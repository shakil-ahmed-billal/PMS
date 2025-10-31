import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Filter,
  MoreVertical,
  Search,
  Tag,
  Trash2,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  ListChecks,
  FolderOpen,
  Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import useAxiosPublic from '../../hooks/useAxiosPublic'

export default function AllTasksPage() {
  const { profile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const axiosPublic = useAxiosPublic()

  useEffect(() => {
    if (profile?.id) loadTasks()
  }, [profile?.id])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const loadTasks = async () => {
    if (!profile?.id) return
    try {
      setLoading(true)
      const res = await axiosPublic.get(`/api/tasks/member/${profile.id}/only`)
      if (res) {
        setTasks(res.data.tasks || [])
      } else {
        setTasks([])
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = [...tasks]

    if (searchTerm) {
      filtered = filtered.filter(task =>
        (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (task.project?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await axiosPublic.delete(`/api/tasks/${taskId}`)
      loadTasks()
      setDropdownOpen(null)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosPublic.patch(`/api/tasks/${taskId}`, { status: newStatus })
      loadTasks()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        class: 'bg-amber-50 text-amber-700 border-amber-200',
        gradient: 'from-amber-500 to-orange-600',
        icon: Clock,
        emoji: '⏳',
        label: 'Pending'
      },
      in_progress: { 
        class: 'bg-blue-50 text-blue-700 border-blue-200',
        gradient: 'from-blue-500 to-indigo-600',
        icon: TrendingUp,
        emoji: '🚀',
        label: 'In Progress'
      },
      completed: { 
        class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        gradient: 'from-emerald-500 to-teal-600',
        icon: CheckCircle,
        emoji: '✓',
        label: 'Completed'
      }
    }
    return configs[status] || configs.pending
  }

  const getPriorityConfig = (priority) => {
    const configs = {
      low: {
        class: 'bg-slate-50 text-slate-700 border-slate-200',
        gradient: 'from-slate-500 to-gray-600',
        emoji: '🟢'
      },
      medium: {
        class: 'bg-amber-50 text-amber-700 border-amber-200',
        gradient: 'from-amber-500 to-orange-600',
        emoji: '🟡'
      },
      high: {
        class: 'bg-red-50 text-red-700 border-red-200',
        gradient: 'from-red-500 to-pink-600',
        emoji: '🔴'
      }
    }
    return configs[priority] || configs.medium
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ListChecks className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10  mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <ListChecks className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    All Tasks
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">Manage and track all your tasks</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-lg">{filteredTasks.length}</span>
                <span className="text-sm">Tasks</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-amber-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-700 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-blue-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-emerald-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-700 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
                  placeholder="Search tasks, projects, or descriptions..."
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full sm:w-48 pl-12 pr-10 py-4 border-2 border-slate-200 rounded-2xl bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="in_progress">🚀 In Progress</option>
                  <option value="completed">✓ Completed</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none w-full sm:w-48 pl-12 pr-10 py-4 border-2 border-slate-200 rounded-2xl bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="all">All Priority</option>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const statusConfig = getStatusConfig(task.status)
            const priorityConfig = getPriorityConfig(task.priority)
            const StatusIcon = statusConfig.icon

            return (
              <div key={task.id} className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 overflow-hidden">
                {/* Gradient Top Border */}
                <div className={`h-2 bg-gradient-to-r ${statusConfig.gradient}`}></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors mb-2">
                        {task.title}
                      </h3>
                      {task.project?.title && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FolderOpen className="w-4 h-4 text-indigo-600" />
                          <span className="truncate">{task.project.title}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === task.id ? null : task.id)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                      {dropdownOpen === task.id && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl z-20 border border-slate-200 overflow-hidden">
                          <div className="py-2">
                            <button
                              onClick={() => setDropdownOpen(null)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Edit3 className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">Edit Task</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="font-medium">Delete Task</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border ${statusConfig.class}`}>
                      <span className="text-base">{statusConfig.emoji}</span>
                      {statusConfig.label}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border capitalize ${priorityConfig.class}`}>
                      <span className="text-base">{priorityConfig.emoji}</span>
                      {task.priority}
                    </span>
                  </div>

                  {/* Deadline */}
                  {task.deadline && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-50 px-3 py-2 rounded-xl">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Status Change */}
                  {task.status !== 'completed' && (
                    <div className="pt-4 border-t border-slate-200">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="w-full px-4 py-3 text-sm font-medium border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="pending">⏳ Change to Pending</option>
                        <option value="in_progress">🚀 Change to In Progress</option>
                        <option value="completed">✓ Mark as Completed</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-16 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ListChecks className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Tasks Found</h3>
              <p className="text-slate-600 text-lg mb-6">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters to see more tasks.'
                  : 'Create your first task to get started on your journey!'}
              </p>
              {!(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl shadow-lg font-medium">
                  <Target className="w-5 h-5" />
                  <span>Start Creating Tasks</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}