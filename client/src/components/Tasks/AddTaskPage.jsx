import { AlertCircle, Award, Briefcase, Calendar, CheckCircle, FileText, Plus, Sparkles, Star, Tag, Target, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import useAxiosPublic from '../../hooks/useAxiosPublic'

export default function AddTaskPage() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    deadline: '',
    project_id: ''
  })
  const axiosPublic = useAxiosPublic()

  useEffect(() => {
    if (profile?.id) {
      loadProjects()
    }
  }, [profile?.id])

  const loadProjects = async () => {
    if (!profile?.id) return

    try {
      const userProjects = await axiosPublic.get(`/api/projects/user/${profile.id}`);

      if (userProjects.status === 200) {
        setProjects(userProjects.data)
      }

      if (userProjects.data.length > 0) {
        setFormData(prev => ({ ...prev, project_id: userProjects.data[0].id }))
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.project_id) {
      setError('Please select a project')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const newTask = {
        id: `task-${Date.now()}`,
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline || null,
        project_id: formData.project_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const createTask = await axiosPublic.post('/api/tasks', newTask)

      if (createTask) {
        setSuccess(true)
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          deadline: '',
          project_id: projects.length > 0 ? projects[0].id : ''
        })

        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityConfig = (priority) => {
    const configs = {
      low: {
        gradient: 'from-slate-500 via-slate-600 to-gray-600',
        lightBg: 'from-slate-50 to-gray-50',
        border: 'border-slate-300',
        ring: 'ring-slate-500',
        icon: '🟢',
        label: 'Low',
        color: 'slate'
      },
      medium: {
        gradient: 'from-amber-500 via-orange-500 to-amber-600',
        lightBg: 'from-amber-50 to-orange-50',
        border: 'border-amber-300',
        ring: 'ring-amber-500',
        icon: '🟡',
        label: 'Medium',
        color: 'amber'
      },
      high: {
        gradient: 'from-red-500 via-rose-500 to-pink-600',
        lightBg: 'from-red-50 to-pink-50',
        border: 'border-red-300',
        ring: 'ring-red-500',
        icon: '🔴',
        label: 'High',
        color: 'red'
      }
    }
    return configs[priority] || configs.medium
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        gradient: 'from-amber-500 via-yellow-500 to-orange-600',
        lightBg: 'from-amber-50 to-yellow-50',
        border: 'border-amber-300',
        ring: 'ring-amber-500',
        icon: '⏳',
        label: 'Pending',
        color: 'amber'
      },
      in_progress: {
        gradient: 'from-blue-500 via-indigo-500 to-blue-600',
        lightBg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-300',
        ring: 'ring-blue-500',
        icon: '🚀',
        label: 'In Progress',
        color: 'blue'
      },
      completed: {
        gradient: 'from-emerald-500 via-teal-500 to-green-600',
        lightBg: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-300',
        ring: 'ring-emerald-500',
        icon: '✓',
        label: 'Completed',
        color: 'emerald'
      }
    }
    return configs[status] || configs.pending
  }

  const currentPriority = getPriorityConfig(formData.priority)
  const currentStatus = getStatusConfig(formData.status)

  return (
    <div className="min-h-screen ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10  h-72 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10  h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  h-[600px] bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto p-4 sm:p-6 lg:p-8 ">
        {/* Hero Header */}
        <div className="text-center mb-12 pt-8 ">
          <div className="flex ">
            <div className="inline-flex items-center justify-center relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col ml-5">
              <h1 className="text-4xl lg:text-5xl flex font-black mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Create Your Next Task
              </h1>
              <p className="text-slate-600 text-base lg:text-lg max-w-2xl mx-auto">
                Transform your ideas into actionable tasks and achieve your goals with precision
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className=" mx-auto mb-8 animate-slideDown">
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Task Created Successfully!</p>
                  <p className="text-emerald-50 text-sm">Your task has been added to the project</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className=" mx-auto mb-8">
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-3xl shadow-2xl">
              <div className="relative p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Oops! Something went wrong</p>
                  <p className="text-red-50 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  mx-auto">
          {/* Left Sidebar - Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-indigo-700 mb-1">Total Projects</p>
                      <p className="text-3xl font-bold text-indigo-900">{projects.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-emerald-700 mb-1">Current Status</p>
                      <p className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                        <span>{currentStatus.icon}</span> {currentStatus.label}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentStatus.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-700 mb-1">Priority Level</p>
                      <p className="text-lg font-bold text-orange-900 flex items-center gap-2">
                        <span>{currentPriority.icon}</span> {currentPriority.label}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentPriority.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">Pro Tips</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Use clear, action-oriented task titles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Set realistic deadlines for better planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Break complex tasks into smaller steps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Review and update task progress regularly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Form Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-8 py-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Task Details</h2>
                    <p className="text-blue-100 text-sm mt-1">Fill in the information below</p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-8 space-y-8">
                {/* Task Title */}
                <div className="group">
                  <label htmlFor="title" className="block text-sm font-bold text-slate-900 mb-3">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                      placeholder="e.g., Design landing page mockup"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label htmlFor="description" className="block text-sm font-bold text-slate-900 mb-3">
                    Description <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none text-slate-900 placeholder-slate-400"
                    placeholder="Provide additional details about the task..."
                  />
                </div>

                {/* Project Selection */}
                <div className="group">
                  <label htmlFor="project_id" className="block text-sm font-bold text-slate-900 mb-3">
                    Select Project <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="project_id"
                      value={formData.project_id}
                      onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer appearance-none text-slate-900"
                    >
                      <option value="">Choose a project...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  {projects.length === 0 && (
                    <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Please create a project first before adding tasks
                    </p>
                  )}
                </div>

                {/* Status and Priority Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Status */}
                  <div className="group">
                    <label htmlFor="status" className="block text-sm font-bold text-slate-900 mb-3">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={`w-full pl-4 pr-16 py-4 border-2 ${currentStatus.border} rounded-2xl bg-gradient-to-br ${currentStatus.lightBg} focus:outline-none focus:ring-4 focus:${currentStatus.ring}/20 focus:border-${currentStatus.color}-500 transition-all cursor-pointer appearance-none text-slate-900 font-medium`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="in_progress">🚀 In Progress</option>
                        <option value="completed">✓ Completed</option>
                      </select>
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-xl bg-gradient-to-br ${currentStatus.gradient} flex items-center justify-center shadow-lg pointer-events-none`}>
                        <span className="text-white text-xl">{currentStatus.icon}</span>
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="group">
                    <label htmlFor="priority" className="block text-sm font-bold text-slate-900 mb-3">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className={`w-full pl-4 pr-16 py-4 border-2 ${currentPriority.border} rounded-2xl bg-gradient-to-br ${currentPriority.lightBg} focus:outline-none focus:ring-4 focus:${currentPriority.ring}/20 focus:border-${currentPriority.color}-500 transition-all cursor-pointer appearance-none text-slate-900 font-medium`}
                      >
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority</option>
                      </select>
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-xl bg-gradient-to-br ${currentPriority.gradient} flex items-center justify-center shadow-lg pointer-events-none`}>
                        <span className="text-white text-xl">{currentPriority.icon}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="group">
                  <label htmlFor="deadline" className="block text-sm font-bold text-slate-900 mb-3">
                    Deadline <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="deadline"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer text-slate-900"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
                <button
                  onClick={handleSubmit}
                  disabled={loading || projects.length === 0}
                  className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Task...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6" />
                        <span>Create Task</span>
                        <TrendingUp className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6  mx-auto mt-8">
          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Quick Actions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Create tasks instantly and stay productive throughout your day</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Goal Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Monitor your progress and achieve milestones with precision</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Team Collaboration</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Work together seamlessly and achieve more as a team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}