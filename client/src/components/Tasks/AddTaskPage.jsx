import { Briefcase, Calendar, CheckCircle, FileText, Plus, Tag } from 'lucide-react'
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

      // Set first project as default if available
      if (userProjects.length > 0) {
        setFormData(prev => ({ ...prev, project_id: userProjects[0].id }))
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
      // Simulate API delay
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
        console.log(createTask)
      }
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        deadline: '',
        project_id: projects.length > 0 ? projects[0].id : ''
      })

    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'from-slate-400 to-slate-500',
      medium: 'from-orange-400 to-orange-500',
      high: 'from-red-400 to-red-500'
    }
    return colors || 'from-slate-400 to-slate-500'
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'from-amber-400 to-amber-500',
      in_progress: 'from-blue-400 to-blue-500',
      completed: 'from-emerald-400 to-emerald-500'
    }
    return colors || 'from-amber-400 to-amber-500'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Add New Task
        </h1>
        <p className="text-slate-600 mt-2">Create a new task and assign it to a project</p>
      </div>

      {success && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
          <span className="text-emerald-800 font-medium">Task created successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4">
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label htmlFor="project_id" className="block text-sm font-semibold text-slate-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Project
            </label>
            <select
              id="project_id"
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(formData.status)}`}></div>
              </div>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(formData.priority)}`}></div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Deadline (Optional)
            </label>
            <input
              type="date"
              id="deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || projects.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Task...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Task
                </div>
              )}
            </button>
          </div>

          {projects.length === 0 && (
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">
                You need to create a project first before adding tasks.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}