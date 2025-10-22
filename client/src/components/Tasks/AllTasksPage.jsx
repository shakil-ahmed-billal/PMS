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
  Trash2
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

  // ✅ FIX: Proper API fetch + data extraction
  const loadTasks = async () => {
    if (!profile?.id) return
    try {
      setLoading(true)
      const res = await axiosPublic.get(`/api/tasks/member/${profile.id}/only`)
      console.log(res)
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

  console.log(tasks)

  const filterTasks = () => {
    let filtered = [...tasks]

    // ✅ FIX: avoid crashing if fields are missing
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

  // ✅ FIX: using API delete if available (fallback to local)
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
      in_progress: { class: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
      completed: { class: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle }
    }
    return badges[status] || { class: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock }
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-slate-100 text-slate-700 border-slate-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    }
    return badges[priority] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            All Tasks
          </h1>
          <p className="text-slate-600 mt-2">Manage and track all your tasks across projects</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          {filteredTasks.length} Tasks
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search tasks and projects..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-slate-500" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const statusInfo = getStatusBadge(task.status)
          const StatusIcon = statusInfo.icon

          return (
            <div key={task.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                  {task.project?.title && (
                    <p className="text-sm text-slate-500 mt-1">
                      in {task.project.title}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === task.id ? null : task.id)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {dropdownOpen === task.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 border border-slate-200 overflow-hidden">
                      <div className="py-1">
                        <button
                          onClick={() => setDropdownOpen(null)}
                          className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 inline mr-2" />
                          Edit Task
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {task.description && (
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${statusInfo.class}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {task.status?.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border capitalize ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {task.deadline && (
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due {new Date(task.deadline).toLocaleDateString()}
                  </div>
                )}

                {task.status !== 'completed' && (
                  <div className="pt-3 border-t border-slate-100">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
            <CheckCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters to see more tasks.'
                : 'Create your first task to get started!'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
