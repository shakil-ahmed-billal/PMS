import { Calendar, DollarSign, CreditCard as Edit3, Eye, Filter, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosPublic from '../../hooks/useAxiosPublic';
// import { demoProjects, getAllProjectsWithProfiles } from '../../lib/demoData';
import Swal from 'sweetalert2';
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
      if (profile.role === 'leader') {
        // Leaders can see all projects with member info
        // data = getAllProjectsWithProfiles();
        data = await axiosPublic.get('/api/projects');

      } else {
        // Members only see their own projects
        console.log(profile)
        const memberProjects = await axiosPublic.get(`/api/projects/user/${profile.id}`);
        console.log(memberProjects)
        data = memberProjects.data;
      }

      // Sort by creation date
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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleDeleteProject = async (projectId) => {

    try {


      // Remove from demo data
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
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            {profile?.role === 'leader'
              ? 'View and monitor all team projects'
              : 'Manage your projects and track progress'
            }
          </p>
        </div>
        {profile?.role === 'member' && (
          <button
            onClick={() => setShowProjectForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search projects..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {project.title}
                  </h3>
                  {profile?.role === 'leader' && 'profiles' in project && (
                    <p className="text-sm text-gray-500 mt-1">
                      by {project.profiles.full_name}
                    </p>
                  )}
                </div>
                {profile?.role === 'Member' && (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === project.id ? null : project.id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {dropdownOpen === project.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedProject(project)
                              setShowProjectDetails(true)
                              setDropdownOpen(null)
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 inline mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(project)
                              setShowProjectForm(true)
                              setDropdownOpen(null)
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit3 className="w-4 h-4 inline mr-2" />
                            Edit Project
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 inline mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {profile?.role === 'leader' && (
                  <button
                    onClick={() => {
                      setSelectedProject(project)
                      setShowProjectDetails(true)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
              </div>

              {project.description && (
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatCurrency(project.amount || 0)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {project.deadline && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No projects found matching your criteria.'
              : 'No projects yet. Create your first project!'
            }
          </div>
          {profile?.role === 'member' && !searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowProjectForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </button>
          )}
        </div>
      )}

      {/* Project Form Modal */}
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

      {/* Project Details Modal */}
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
  );
}
