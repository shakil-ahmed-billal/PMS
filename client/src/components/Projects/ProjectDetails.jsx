import { AlertCircle, Calendar, CheckCircle, Clock, DollarSign, CreditCard as Edit3, Plus, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { demoTasks } from '../../lib/demoData';

export default function ProjectDetails({ project, onClose, onProjectUpdated }) {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    deadline: ''
  });

  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    loadTasks();
  }, [project.id]);

  const loadTasks = async () => {
    try {
      setLoading(true);


      const taskData = await axiosPublic.get(`/api/tasks/${project.id}`)
      if (taskData.data) {
        console.log(taskData)
        setTasks(taskData.data.data);
      }

    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {


      const newTask = {
        id: `task-${Date.now()}`,
        ...taskFormData,
        project_id: project.id,
        deadline: taskFormData.deadline || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const createTask = await axiosPublic.post('/api/tasks', newTask)
      if (createTask) {

        console.log(createTask)

        setTaskFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          deadline: ''
        });

        toast.success('Task created successfully!');
      }



      setShowTaskForm(false);
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    try {

      const updateTask = await axiosPublic.put(`/api/tasks/${editingTask.id}`, taskFormData)

      if (updateTask) {
        console.log(updateTask)


        setEditingTask(null);
        setShowTaskForm(false);
        setTaskFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          deadline: ''
        });
        loadTasks();
        toast.success('Task updated successfully!');
      }


    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {


    try {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const deleteTask = await axiosPublic.delete(`/api/tasks/${taskId}`);
          if (deleteTask) {
            console.log(deleteTask)
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            loadTasks();
          }
        }
      });


    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const index = demoTasks.findIndex(t => t.id === taskId);
      if (index > -1) {
        demoTasks[index] = {
          ...demoTasks[index],
          status: newStatus,
          updated_at: new Date().toISOString()
        };
      }

      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      deadline: task.deadline || ''
    });
    setShowTaskForm(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-yellow-100 text-yellow-800', icon: Clock },
      in_progress: { class: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      completed: { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { class: 'bg-red-100 text-red-800', icon: X }
    };
    return badges[status] || { class: 'bg-gray-100 text-gray-800', icon: Clock };
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isOwner = profile?.role === 'Member' && project.member_id === profile.id;

  const statusInfo = getStatusBadge(project.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusInfo.class}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {project.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {formatCurrency(project.amount || 0)}
                    </div>
                    {'profiles' in project && (
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {project.profiles.full_name}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="mb-6">
                {project.description && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Progress</h4>
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>{project.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {project.deadline && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Deadline</h4>
                      <div className="mt-1 flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Created</h4>
                    <div className="mt-1 text-gray-600">
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tasks ({tasks.length})
                  </h3>
                  {isOwner && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tasks yet. {isOwner && 'Create your first task!'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => {
                      const taskStatusInfo = getStatusBadge(task.status)
                      const TaskStatusIcon = taskStatusInfo.icon

                      return (
                        <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize ${taskStatusInfo.class}`}>
                                  <TaskStatusIcon className="w-3 h-3 mr-1" />
                                  {task.status.replace('_', ' ')}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityBadge(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              {task.description && (
                                <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                {task.deadline && (
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(task.deadline).toLocaleDateString()}
                                  </div>
                                )}
                                <div>
                                  Created {new Date(task.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {isOwner && (
                              <div className="flex items-center space-x-2 ml-4">
                                {task.status !== 'completed' && (
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                  </select>
                                )}
                                <button
                                  onClick={() => openEditTask(task)}
                                  className="text-gray-400 hover:text-blue-600"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {showTaskForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed  -z-10 inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                setShowTaskForm(false);
                                setEditingTask(null);
                                setTaskFormData({
                                  title: '',
                                  description: '',
                                  status: 'pending',
                                  priority: 'medium',
                                  deadline: ''
                                });
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">
                                Task Title
                              </label>
                              <input
                                type="text"
                                id="taskTitle"
                                value={taskFormData.title}
                                onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                id="taskDescription"
                                rows={3}
                                value={taskFormData.description}
                                onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">
                                  Status
                                </label>
                                <select
                                  id="taskStatus"
                                  value={taskFormData.status}
                                  onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>

                              <div>
                                <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700">
                                  Priority
                                </label>
                                <select
                                  id="taskPriority"
                                  value={taskFormData.priority}
                                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="taskDeadline" className="block text-sm font-medium text-gray-700">
                                Deadline
                              </label>
                              <input
                                type="date"
                                id="taskDeadline"
                                value={taskFormData.deadline}
                                onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {editingTask ? 'Update Task' : 'Create Task'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowTaskForm(false);
                              setEditingTask(null);
                              setTaskFormData({
                                title: '',
                                description: '',
                                status: 'pending',
                                priority: 'medium',
                                deadline: ''
                              });
                            }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
