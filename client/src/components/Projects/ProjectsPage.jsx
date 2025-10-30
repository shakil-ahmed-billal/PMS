import { Calendar, DollarSign, Edit3, Eye, Filter, MoreVertical, Plus, Search, Trash2, Clock, TrendingUp, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import live from '../../assets/icon/live.png';
import Sheet from '../../assets/icon/sheets.png';
import telegram from '../../assets/icon/telegram.png';
import CountdownTimer from '../ShereCode/Countdown';
import ProjectDetails from './ProjectDetails';
import ProjectForm from './ProjectForm';

export default function ProjectsPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    loadProjects();
  }, [profile?.id]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const loadProjects = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      let data;
      if (profile.role === 'Leader') {
        const response = await axiosPublic.get(`/api/leader/${profile.id}/projects`);
        data = response.data.data;
      } else {
        const memberProjects = await axiosPublic.get(`/api/projects/user/${profile.id}`);
        data = memberProjects.data;
      }

      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const index = axiosPublic.delete(`/api/projects/${projectId}`);
          if (index) {
            loadProjects();
            setDropdownOpen(null);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        }
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleProjectCreated = () => {
    setShowProjectForm(false);
    setSelectedProject(null);
    loadProjects();
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      in_progress: '🚀',
      completed: '✓',
      cancelled: '✕'
    };
    return icons[status] || '📋';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', value: projects.length, color: 'bg-indigo-500', icon: Briefcase },
    { label: 'In Progress', value: projects.filter(p => p.status === 'in_progress').length, color: 'bg-blue-500', icon: TrendingUp },
    { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'bg-emerald-500', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                Projects Dashboard
              </h1>
              <p className="text-slate-600 mt-2 text-sm lg:text-base">
                {profile?.role === 'Leader'
                  ? 'Monitor and manage all team projects in one place'
                  : 'Track your projects and achieve your goals'
                }
              </p>
            </div>
            {profile?.role === 'member' && (
              <button
                onClick={() => setShowProjectForm(true)}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 font-medium group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                New Project
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Search projects by name or description..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full sm:w-48 pl-12 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="date" 
                  className="appearance-none w-full sm:w-48 pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden">
              {/* Project Image */}
              {project.projectPhotoURL && (
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={project.projectPhotoURL}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border backdrop-blur-sm ${getStatusBadge(project.status)}`}>
                      <span>{getStatusIcon(project.status)}</span>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h3>
                    {profile?.role === 'Leader' && 'profiles' in project && (
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {project.profiles.full_name.charAt(0)}
                        </div>
                        {project.profiles.full_name}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {profile?.role === 'Member' && (
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === project.id ? null : project.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                      {dropdownOpen === project.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 z-20 overflow-hidden">
                          <div className="py-2">
                            <button
                              onClick={() => {
                                setSelectedProject(project)
                                setShowProjectDetails(true)
                                setDropdownOpen(null)
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Eye className="w-4 h-4 text-indigo-600" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProject(project)
                                setShowProjectForm(true)
                                setDropdownOpen(null)
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                              Edit Project
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Project
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {profile?.role === 'Leader' && (
                    <button
                      onClick={() => {
                        setSelectedProject(project)
                        setShowProjectDetails(true)
                      }}
                      className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group/btn"
                    >
                      <Eye className="w-5 h-5 text-indigo-600 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>
                )}

                {/* Budget */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <span className="text-sm font-medium text-slate-700">Project Budget</span>
                  <span className="text-lg font-bold text-emerald-700 flex items-center gap-1">
                    <DollarSign className="w-5 h-5" />
                    {formatCurrency(project.amount || 0)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Progress</span>
                    <span className="font-bold text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(project.progress)} shadow-lg`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dates and Links */}
                {project.deadline && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Started: {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.telegramURL && (
                          <a href={project.telegramURL} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors">
                            <img src={telegram} className="w-5 h-5" alt="Telegram" />
                          </a>
                        )}
                        {project.sheetURL && (
                          <a href={project.sheetURL} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors">
                            <img src={Sheet} className="w-5 h-5" alt="Sheet" />
                          </a>
                        )}
                        {project.websiteURL && (
                          <a href={project.websiteURL} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors">
                            <img src={live} className="w-5 h-5" alt="Live" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <CountdownTimer project={project} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No Projects Found' : 'No Projects Yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first project to get started!'
              }
            </p>
            {profile?.role === 'member' && !searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowProjectForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </button>
            )}
          </div>
        )}

        {/* Modals */}
        {showProjectForm && (
          <ProjectForm
            project={selectedProject}
            onClose={() => {
              setShowProjectForm(false)
              setSelectedProject(null)
            }}
            onProjectCreated={handleProjectCreated}
          />
        )}

        {showProjectDetails && selectedProject && (
          <ProjectDetails
            project={selectedProject}
            onClose={() => {
              setShowProjectDetails(false)
              setSelectedProject(null)
            }}
            onProjectUpdated={loadProjects}
          />
        )}
      </div>
    </div>
  );
}