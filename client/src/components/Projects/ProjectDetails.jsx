import { AlertCircle, Calendar, CheckCircle, Clock, DollarSign, Edit3, Plus, Trash2, User, X, Target, TrendingUp, Zap, Flag } from 'lucide-react';
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
      pending: { class: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, gradient: 'from-amber-500 to-orange-500' },
      in_progress: { class: 'bg-blue-50 text-blue-700 border-blue-200', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-500' },
      completed: { class: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500' },
      cancelled: { class: 'bg-red-50 text-red-700 border-red-200', icon: X, gradient: 'from-red-500 to-pink-500' }
    };
    return badges[status] || { class: 'bg-slate-50 text-slate-700 border-slate-200', icon: Clock, gradient: 'from-slate-500 to-gray-500' };
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: { class: 'bg-slate-100 text-slate-700 border-slate-200', icon: '🟢' },
      medium: { class: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🟡' },
      high: { class: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' }
    };
    return badges[priority] || { class: 'bg-slate-100 text-slate-700 border-slate-200', icon: '⚪' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'from-emerald-500 to-teal-500';
    if (progress >= 50) return 'from-blue-500 to-indigo-500';
    if (progress >= 25) return 'from-amber-500 to-orange-500';
    return 'from-slate-400 to-gray-500';
  };

  const isOwner = profile?.role === 'Member' && project.member_id === profile.id;
  const statusInfo = getStatusBadge(project.status);
  const StatusIcon = statusInfo.icon;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex items-start justify-center min-h-screen p-4 sm:p-6">
        <div className="relative w-full max-w-6xl bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl transform transition-all my-8">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-t-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative px-6 py-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${statusInfo.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <StatusIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">{project.title}</h2>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border backdrop-blur-sm bg-white/20 text-white border-white/30`}>
                          <StatusIcon className="w-4 h-4" />
                          {project.status.replace('_', ' ')}
                        </span>
                        {'profiles' in project && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-sm bg-white/20 text-white border border-white/30">
                            <User className="w-4 h-4" />
                            {project.profiles.full_name}
                          </span>
                        )}
                      </div>
                    </div>
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

          {/* Content Section */}
          <div className="px-4 sm:px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Project Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Budget</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">{formatCurrency(project.amount || 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Progress</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{project.progress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Total Tasks</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">{tasks.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Progress */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 mb-6 shadow-sm">
              {project.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📋</span>
                    </div>
                    Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900">Overall Progress</h4>
                  <span className="text-lg font-bold text-slate-900">{project.progress}%</span>
                </div>
                <div className="relative w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(project.progress)} shadow-lg relative overflow-hidden`}
                    style={{ width: `${project.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600">Created Date</p>
                      <p className="text-sm font-bold text-slate-900">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {project.deadline && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Flag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600">Deadline</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    Tasks Management
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                    <span className="text-emerald-600 font-medium">✓ {completedTasks} Completed</span>
                    <span className="text-blue-600 font-medium">→ {inProgressTasks} In Progress</span>
                    <span className="text-amber-600 font-medium">⏳ {pendingTasks} Pending</span>
                  </div>
                </div>
                {isOwner && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all font-medium group whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Add Task
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-slate-600 font-medium">No tasks yet</p>
                  {isOwner && <p className="text-slate-500 text-sm mt-1">Create your first task to get started!</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => {
                    const taskStatusInfo = getStatusBadge(task.status)
                    const TaskStatusIcon = taskStatusInfo.icon
                    const priorityInfo = getPriorityBadge(task.priority)

                    return (
                      <div key={task.id} className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h4 className="font-bold text-slate-900 text-base sm:text-lg">{task.title}</h4>
                              <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-lg border ${taskStatusInfo.class}`}>
                                <TaskStatusIcon className="w-3 h-3" />
                                {task.status.replace('_', ' ')}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg border ${priorityInfo.class}`}>
                                <span>{priorityInfo.icon}</span>
                                {task.priority}
                              </span>
                            </div>
                            {task.description && (
                              <p className="text-slate-600 text-sm leading-relaxed mb-3">{task.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              {task.deadline && (
                                <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.deadline).toLocaleDateString()}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Created {new Date(task.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {isOwner && (
                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                              {task.status !== 'completed' && (
                                <select
                                  value={task.status}
                                  onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                                  className="text-xs border-2 border-slate-200 rounded-lg px-3 py-2 font-medium bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              )}
                              <button
                                onClick={() => openEditTask(task)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/btn"
                              >
                                <Edit3 className="w-4 h-4 text-blue-600 group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group/btn"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 group-hover/btn:scale-110 transition-transform" />
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
          </div>

          {/* Task Form Modal */}
          {showTaskForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all">
                  <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl px-6 py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                          </h3>
                        </div>
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
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="px-6 py-6 space-y-5">
                      <div>
                        <label htmlFor="taskTitle" className="block text-sm font-bold text-slate-900 mb-2">
                          Task Title *
                        </label>
                        <input
                          type="text"
                          id="taskTitle"
                          value={taskFormData.title}
                          onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                          required
                          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter task title..."
                        />
                      </div>

                      <div>
                        <label htmlFor="taskDescription" className="block text-sm font-bold text-slate-900 mb-2">
                          Description
                        </label>
                        <textarea
                          id="taskDescription"
                          rows={4}
                          value={taskFormData.description}
                          onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                          placeholder="Describe the task details..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="taskStatus" className="block text-sm font-bold text-slate-900 mb-2">
                            Status
                          </label>
                          <select
                            id="taskStatus"
                            value={taskFormData.status}
                            onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="in_progress">🚀 In Progress</option>
                            <option value="completed">✓ Completed</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="taskPriority" className="block text-sm font-bold text-slate-900 mb-2">
                            Priority
                          </label>
                          <select
                            id="taskPriority"
                            value={taskFormData.priority}
                            onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                          >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="taskDeadline" className="block text-sm font-bold text-slate-900 mb-2">
                          Deadline
                        </label>
                        <input
                          type="date"
                          id="taskDeadline"
                          value={taskFormData.deadline}
                          onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 rounded-b-2xl flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
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
                        className="w-full sm:w-auto px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
                      >
                        {editingTask ? 'Update Task' : 'Create Task'}
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
  );
}