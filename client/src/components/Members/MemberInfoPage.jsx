import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Calendar, CheckCircle, XCircle, Briefcase, TrendingUp, DollarSign } from 'lucide-react';
import useAxiosPublic from '../../hooks/useAxiosPublic';

export default function MemberInfoPage() {
  const { profile } = useAuth();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (profile?.role === 'Leader') {
      loadMembers();
    }
  }, [profile]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      
      // Fetch members from the backend API
      const responseAllMembers = await axiosPublic.get(`/api/leader/${profile.id}/members`);

      setMembers(responseAllMembers.data.data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMemberDetails = async (memberId) => {
    try {
      const response = await axiosPublic.get(`/api/leader/${profile.id}/members/${memberId}/details`);

      setSelectedMember({
        ...response.data.member,
        projects: response.data.projects,
        tasks: response.data.tasks,
        stats: response.data.stats
      });
    } catch (error) {
      console.error('Error loading member details:', error);
    }
  };

  const handleStatusToggle = async (memberId) => {
    try {
      // Toggle member status and reload member details
      const response = await axiosPublic.patch(`/api/leader/${profile.id}/members/${memberId}/status`);
      loadMemberDetails(memberId);
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (profile?.role !== 'Leader') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Access denied. This page is only available for leaders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Member Information</h1>
        <p className="text-slate-600 mt-2">Detailed view of team member performance and projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Member List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Team Members</h2>
            <div className="space-y-3">
              {members.map((member) => (
                <button
                  key={member._id}
                  onClick={() => loadMemberDetails(member._id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${selectedMember?._id === member._id ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMember?._id === member._id ? 'bg-white/20' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
                      <User className={`w-4 h-4 ${selectedMember?.id === member._id ? 'text-white' : 'text-white'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      <p className={`text-xs truncate ${selectedMember?._id === member._id ? 'text-white/70' : 'text-slate-500'}`}>{member.department}</p>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 text-xs rounded-full border capitalize ${member.status === 'verified' ? selectedMember?._id === member._id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700' : selectedMember?._id === member._id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {member.status === 'verified' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="lg:col-span-3">
          {selectedMember ? (
            <div className="space-y-6">
              {/* Member Profile Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedMember.name}</h2>
                      <p className="text-slate-600">{selectedMember.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(selectedMember._id)}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${selectedMember.status === 'verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'}`}
                  >
                    {selectedMember.status === 'verified' ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {selectedMember.status === 'verified' ? 'Verified - Click to Unverify' : 'Unverified - Click to Verify'}
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-500">Total Projects</p>
                        <p className="text-2xl font-bold text-slate-900">{selectedMember.stats.totalProjects}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-500">Completed</p>
                        <p className="text-2xl font-bold text-slate-900">{selectedMember.stats.completedProjects}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-500">Avg Progress</p>
                        <p className="text-2xl font-bold text-slate-900">{selectedMember.stats.averageProgress}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-500">Total Value</p>
                        <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedMember.stats.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projects List */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Projects ({selectedMember.projects.length})</h3>
                  </div>
                  <div className="p-6">
                    {selectedMember.projects.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        No projects found for this member.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedMember.projects.map((project) => (
                          <div key={project.id} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">{project.title}</h4>
                                {project.description && (
                                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{project.description}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-3">
                                  {/* <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusBadge(project.status)}`}>
                                    {project.status.replace('_', ' ')}
                                  </span> */}
                                  <span className="text-sm text-slate-600">
                                    {formatCurrency(project.amount || 0)}
                                  </span>
                                  {project.deadline && (
                                    <span className="text-sm text-slate-500">
                                      Due {new Date(project.deadline).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-sm font-medium text-slate-900">{project.progress}%</div>
                                <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
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
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
              <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Member</h3>
              <p className="text-slate-500">Choose a team member from the list to view their details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
