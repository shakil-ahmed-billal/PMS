import { Calendar, DollarSign, User, X, Upload, FileImage, Link2, FileSpreadsheet, Globe, MessageCircle, Target, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { imageUpload } from '../../API/ImageAPI';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';

export default function ProjectForm({ project, onClose, onProjectCreated }) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null)
  const [imageLink, setImageLink] = useState("");

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
      websiteURL: project?.websiteURL || '',
      projectPhotoURL: project?.projectPhotoURL || '',
    }
  });

  const axiosPublic = useAxiosPublic();

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImage(file)
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageLink(imageURL);
    }
  };

  const onSubmit = async (data) => {
    if (!profile?.id) return;

    setLoading(true);
    setError('');

    let projectPhotoLink = '' ;

    if (image) {
      const imageFile = image
      const imageURL = await imageUpload(imageFile)
      projectPhotoLink = imageURL;
    }

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
      projectPhotoURL: image ? projectPhotoLink : data.projectPhotoURL || '',
      websiteURL: data.websiteURL
    };

    try {
      let response;

      if (project) {
        response = await axiosPublic.put(`/api/projects/${project.id}`, projectData);
        toast.success('Project updated successfully!');
      } else {
        response = await axiosPublic.post('/api/projects', projectData);
        toast.success('Project created successfully!');
      }

      if (response.data) {
        onProjectCreated();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      setImageLink(project.projectPhotoURL || '');
    }
  }, [project, setValue]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-t-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {project ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {project ? 'Update your project details' : 'Fill in the details to create a new project'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-4 sm:px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Project Image Upload Section */}
            <div className="mb-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border-2 border-dashed border-slate-300">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                    {!imageLink ? (
                      <FileImage className="w-12 h-12 text-slate-400" />
                    ) : (
                      <img
                        src={imageLink}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label 
                    htmlFor="projectImage" 
                    className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all group"
                  >
                    <Upload className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </label>
                  <input
                    type="file"
                    id="projectImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700">Project Cover Image</p>
                  <p className="text-xs text-slate-500 mt-1">Upload a cover image for your project</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  Basic Information
                </h4>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="title" className="block text-sm font-bold text-slate-900 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register('title', { required: 'Title is required' })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter your project title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.title.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-bold text-slate-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      {...register('description', { required: 'Description is required' })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your project in detail..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Project Details Section */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Project Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Project Amount *
                    </label>
                    <input
                      type="number"
                      id="amount"
                      step="0.01"
                      {...register('amount', { required: 'Amount is required' })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.amount.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-bold text-slate-900 mb-2">
                      Project Status
                    </label>
                    <select
                      id="status"
                      {...register('status')}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in_progress">🚀 In Progress</option>
                      <option value="completed">✓ Completed</option>
                      <option value="cancelled">✕ Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="deadline" className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      id="deadline"
                      {...register('deadline')}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="progress" className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      Progress (%)
                    </label>
                    <input
                      type="number"
                      id="progress"
                      min="0"
                      max="100"
                      {...register('progress')}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Project Links Section */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-white" />
                  </div>
                  Project Links
                </h4>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="websiteURL" className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      Website URL *
                    </label>
                    <input
                      type="url"
                      id="websiteURL"
                      {...register('websiteURL', { required: 'Website URL is required' })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://example.com"
                    />
                    {errors.websiteURL && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.websiteURL.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="telegramURL" className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      Telegram URL *
                    </label>
                    <input
                      type="url"
                      id="telegramURL"
                      {...register('telegramURL', { required: 'Telegram URL is required' })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://t.me/..."
                    />
                    {errors.telegramURL && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.telegramURL.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="sheetURL" className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      Google Sheet URL *
                    </label>
                    <input
                      type="url"
                      id="sheetURL"
                      {...register('sheetURL', { required: 'Sheet URL is required' })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="https://docs.google.com/spreadsheets/..."
                    />
                    {errors.sheetURL && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.sheetURL.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 rounded-b-3xl border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  {project ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}