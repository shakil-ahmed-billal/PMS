import { Calendar, DollarSign, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { imageUpload } from '../../API/ImageAPI';
import { UserRoundPen } from 'lucide-react';

export default function ProjectForm({ project, onClose, onProjectCreated }) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    const [image, setImage] = useState(null)
     const [imageLink, setImageLink] = useState("");

  // Default form values, they will be controlled by react-hook-form
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      amount: project?.amount || '',
      status: project?.status || 'pending',
      deadline: project?.deadline || '',
      progress: project?.progress || 0,
      telegramURL: project?.telegramURL || '',
      sheetURL: project?.sheetURL || '',
      imageFile: project?.projectPhotoURL || '',
      websiteURL: project?.websiteURL || ''
    }
  });

  const axiosPublic = useAxiosPublic();
   // user image profile function
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImage(file)
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageLink(imageURL);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!profile?.id) return;

    setLoading(true);
    setError('');

    const imageFile = image
    const projectPhotoURL = await imageUpload(imageFile)

    const projectData = {
      id: project?.id || `project-${Date.now()}`,
      title: data.title,
      description: data.description,
      amount: parseFloat(data.amount) || 0,
      status: data.status,
      deadline: data.deadline || null,
      progress: data.progress,
      member_id: profile.id,
      created_at: project?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      telegramURL: data.telegramURL,
      sheetURL: data.sheetURL,
      projectPhotoURL,
      websiteURL: data.websiteURL
    };

    try {
      let response;

      if (project) {
        // Update existing project
        response = await axiosPublic.put(`/api/projects/${project.id}`, projectData);
        toast.success('Project updated successfully!');
      } else {
        // Create new project
        response = await axiosPublic.post('/api/projects', projectData);
        toast.success('Project created successfully!');
      }

      if (response.data) {
        onProjectCreated();
        onClose(); // Close modal after submission
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Watch form values (useful for debugging)
  useEffect(() => {
    // Update default values with the existing project data when the component is loaded
    if (project) {
      setValue('title', project.title);
      setValue('description', project.description);
      setValue('amount', project.amount);
      setValue('status', project.status);
      setValue('deadline', project.deadline);
      setValue('progress', project.progress);
      setValue('telegramURL', project.telegramURL);
      setValue('sheetURL', project.sheetURL);
      setValue('projectPhotoURL', project.projectPhotoURL);
      setValue('websiteURL', project.websiteURL);
    }
  }, [project, setValue]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed -z-10 inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {project ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
              {/* yser profile image section */}
            <div className=" text-center dark:text-light2 flex flex-row-reverse justify-center items-center gap-3">
              <input
                type="file"
                name="image"
                id="fourthImage"
                className="w-28"
                onChange={handleFileChange} />
              <div className="w-[100px] h-[100px] rounded-full border border-[#e5eaf2] flex items-center justify-center">
                {!imageLink ? (
                  <UserRoundPen className="size-10 text-[#e5eaf2]" />
                ) : (
                  <img
                    src={imageLink}
                    alt="image"
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
            </div>
            {/* yser profile image section */}

            {/* Add Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              {/* new telegram url field added */}
              <div>
                <label htmlFor="telegramURL" className="block text-sm font-medium text-gray-700">
                  Telegram URL
                </label>

                <input
                  type="telegramURL"
                  id="telegramURL"
                  {...register('telegramURL', { required: 'telegramURL is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project title"
                />
                {errors.telegramURL && <p className="text-red-500 text-sm">{errors.telegramURL.message}</p>}
              </div>
               {/* new website url field added */}
              <div>
                <label htmlFor="websiteURL" className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>

                <input
                  type="websiteURL"
                  id="websiteURL"
                  {...register('websiteURL', { required: 'websiteURL is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project title"
                />
                {errors.websiteURL && <p className="text-red-500 text-sm">{errors.websiteURL.message}</p>}
              </div>
              {/* new google sheet fields added */}
              <div>
                <label htmlFor="sheetURl" className="block text-sm font-medium text-gray-700">
                  Project Google Sheet URL</label>

                <input
                  type="sheetURL"
                  id="sheetURL"
                  {...register('sheetURL', { required: 'sheetURL is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project title"
                />
                {errors.sheetURL && <p className="text-red-500 text-sm">{errors.sheetURL.message}</p>}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project description"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Delivery Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    {...register('amount', { required: 'Amount is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    {...register('deadline')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    id="progress"
                    min="0"
                    max="100"
                    {...register('progress')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
