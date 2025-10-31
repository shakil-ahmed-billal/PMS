import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FolderOpen,
  Plus,
  TrendingUp,
  AlertCircle,
  Target,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import ProjectForm from '../Projects/ProjectForm';

export default function MemberDashboard() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    completedProjects: 0,
    cancelledProjects: 0,
    totalAmount: 0,
    completedAmount: 0,
    pendingAmount: 0,
    averageProgress: 0
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (profile?.id) {
      loadProjectsAndStats();
    }
  }, [profile?.id]);

  const loadProjectsAndStats = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      const userProjectsData = await axiosPublic.get(`/api/projects/user/${profile.id}`);
      if (userProjectsData?.data) {
        const projectsData = userProjectsData.data;
        setProjects(projectsData);

        const totalProjects = projectsData.length || 0;
        const pendingProjects = projectsData.filter(p => p.status === 'pending').length || 0;
        const inProgressProjects = projectsData.filter(p => p.status === 'in_progress').length || 0;
        const completedProjects = projectsData.filter(p => p.status === 'completed').length || 0;
        const cancelledProjects = projectsData.filter(p => p.status === 'cancelled').length || 0;

        const totalAmount = projectsData.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        const completedAmount = projectsData.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        const pendingAmount = projectsData.filter(p => p.status === 'pending' || p.status === 'in_progress').reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        const averageProgress = totalProjects > 0
          ? Math.round(projectsData.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
          : 0;

        setStats({
          totalProjects,
          pendingProjects: pendingProjects + inProgressProjects,
          completedProjects,
          cancelledProjects,
          totalAmount,
          completedAmount,
          pendingAmount,
          averageProgress
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    setShowProjectForm(false);
    loadProjectsAndStats();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200'
    };
    return badges[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const upcoming = projects
      .filter(p => p.deadline && p.status !== 'completed' && p.status !== 'cancelled')
      .filter(p => {
        const deadline = new Date(p.deadline);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return upcoming.slice(0, 5);
  };

  const getProjectStatusData = () => {
    const total = stats.totalProjects || 1;
    return [
      { status: 'Completed', count: stats.completedProjects, percentage: Math.round((stats.completedProjects / total) * 100), color: 'bg-emerald-500' },
      { status: 'In Progress', count: stats.pendingProjects, percentage: Math.round((stats.pendingProjects / total) * 100), color: 'bg-blue-500' },
      { status: 'Cancelled', count: stats.cancelledProjects, percentage: Math.round((stats.cancelledProjects / total) * 100), color: 'bg-red-500' },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  const completionRate = stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
              Welcome back, {profile?.full_name}! 👋
            </h1>
            <p className="text-slate-600 mt-2 text-sm lg:text-base">
              Here's what's happening with your projects today
            </p>
          </div>
          <button
            onClick={() => setShowProjectForm(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all font-medium group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            New Project
          </button>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FolderOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                Active
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalProjects}</p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                <Activity className="w-3 h-3" />
                Ongoing
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-slate-900">{stats.pendingProjects}</p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {completionRate}%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-slate-900">{stats.completedProjects}</p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-purple-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-purple-600 flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                <Zap className="w-3 h-3" />
                AVG
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">Avg Progress</p>
            <p className="text-3xl font-bold text-slate-900">{stats.averageProgress}%</p>
          </div>
        </div>

        {/* Financial Overview & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                  Total Value
                </span>
              </div>
              <p className="text-sm font-medium text-emerald-50 mb-2">Total Project Value</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalAmount)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  Pending
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-2">Pending Value</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.pendingAmount)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  Earned
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-2">Completed Value</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.completedAmount)}</p>
            </div>
          </div>

          {/* Project Status Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  Project Status Overview
                </h3>
                <p className="text-sm text-slate-600 mt-1">Distribution of your projects</p>
              </div>
            </div>

            <div className="space-y-4">
              {getProjectStatusData().map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                      <span className="font-medium text-slate-700">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">{item.count} projects</span>
                      <span className="font-bold text-slate-900 min-w-[3rem] text-right">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500 shadow-lg relative`}
                      style={{ width: `${item.percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                <p className="text-xs font-medium text-blue-700 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-900">{completionRate}%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                <p className="text-xs font-medium text-purple-700 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalProjects > 0 ? Math.round((stats.completedProjects / (stats.totalProjects - stats.cancelledProjects)) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects & Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    Recent Projects
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">Your latest project activities</p>
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                  {projects.length} Total
                </span>
              </div>
            </div>
            <div className="p-6">
              {projects.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-slate-600 font-medium mb-2">No projects yet</p>
                  <p className="text-slate-500 text-sm mb-4">Create your first project to get started!</p>
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Create Project
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 mb-2 truncate">{project.title}</h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-lg border capitalize ${getStatusBadge(project.status)}`}>
                            {project.status.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                            {formatCurrency(project.amount || 0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 mb-1">{project.progress}%</div>
                          <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500 shadow-lg"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
              </div>
              <p className="text-sm text-slate-600">Next 7 days</p>
            </div>
            <div className="p-6">
              {getUpcomingDeadlines().length === 0 ? (
                <div className="text-center py-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-slate-600 font-medium text-sm">No upcoming deadlines</p>
                  <p className="text-slate-500 text-xs mt-1">You're all caught up! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getUpcomingDeadlines().map((project) => {
                    const deadline = new Date(project.deadline);
                    const today = new Date();
                    const diffTime = deadline.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return (
                      <div key={project.id} className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-bold text-slate-900 text-sm flex-1 line-clamp-2">{project.title}</h4>
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
                            diffDays <= 1 ? 'bg-red-100 text-red-700 border border-red-200' :
                            diffDays <= 3 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {diffDays === 0 ? '🔥 Today' : diffDays === 1 ? '⚡ Tomorrow' : `📅 ${diffDays} days`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Calendar className="w-3.5 h-3.5" />
                          {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Form Modal */}
        {showProjectForm && (
          <ProjectForm
            onClose={() => setShowProjectForm(false)}
            onProjectCreated={handleProjectCreated}
          />
        )}
      </div>
    </div>
  );
}