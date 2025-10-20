import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { demoUsers, getProjectsByMemberId } from '../../lib/demoData'
import { 
  Users, 
  Search, 
  Filter, 
  User, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Briefcase,
  TrendingUp
} from 'lucide-react'
import useAxiosPublic from '../../hooks/useAxiosPublic'



export default function AllMembersPage() {
  const { profile } = useAuth()
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMember, setSelectedMember] = useState(null)
  const axiosPublic = useAxiosPublic()

  useEffect(() => {
    if (profile?.role === 'Leader') {
      loadMembers()
    }
  }, [profile])

  useEffect(() => {
    filterMembers()
  }, [members, searchTerm, statusFilter])

  const loadMembers = async () => {
    try {
      setLoading(true);

      // Fetch members and projects from the backend API
      const responseAllMembers = await axiosPublic.get(`/api/leader/${profile.id}/members`);
      const responseAllProjects = await axiosPublic.get(`/api/leader/${profile.id}/projects`);

      const allMembers = responseAllMembers.data.data;  // List of all members
      const allProjects = responseAllProjects.data.data; // List of all projects

      // Calculate stats for each member
      const membersWithStats = allMembers.map((member) => {
        const projects = allProjects.filter(p => p.member_id === member._id);  // Find projects for the current member
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const totalAmount = projects.reduce((sum, p) => sum + (p.amount || 0), 0);

        return {
          ...member,
          projectCount: projects.length,
          completedProjects,
          totalAmount
        };
      });

      setMembers(membersWithStats);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...members]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter)
    }

    setFilteredMembers(filtered)
  }

  const handleStatusToggle = async (memberId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const memberIndex = demoUsers.findIndex(u => u.id === memberId)
      if (memberIndex > -1) {
        demoUsers[memberIndex].status = demoUsers[memberIndex].status === 'verified' ? 'unverified' : 'verified'
      }

      loadMembers()
    } catch (error) {
      console.error('Error updating member status:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (profile?.role !== 'Leader') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Access denied. This page is only available for leaders.</p>
      </div>
    )
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
            All Members
          </h1>
          <p className="text-slate-600 mt-2">Manage team members and their verification status</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          {filteredMembers.length} Members
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Total Members</p>
              <p className="text-2xl font-bold text-slate-900">{members.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Verified</p>
              <p className="text-2xl font-bold text-slate-900">
                {members.filter(m => m.status === 'verified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Unverified</p>
              <p className="text-2xl font-bold text-slate-900">
                {members.filter(m => m.status === 'unverified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Avg Projects</p>
              <p className="text-2xl font-bold text-slate-900">
                {members.length > 0 ? Math.round(members.reduce((sum, m) => sum + m.projectCount, 0) / members.length) : 0}
              </p>
            </div>
          </div>
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
                placeholder="Search members by name, email, or department..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {member.full_name}
                  </h3>
                  <p className="text-sm text-slate-500">{member.department}</p>
                </div>
              </div>
              <button
                onClick={() => handleStatusToggle(member.id)}
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 ${
                  member.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                }`}
              >
                {member.status === 'verified' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="w-4 h-4 mr-2" />
                {member.email}
              </div>

              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {new Date(member.join_date).toLocaleDateString()}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{member.projectCount}</p>
                  <p className="text-xs text-slate-500">Projects</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{member.completedProjects}</p>
                  <p className="text-xs text-slate-500">Completed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(member.totalAmount)}</p>
                  <p className="text-xs text-slate-500">Value</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(member.id)}
                className="w-full mt-4 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-500 hover:to-indigo-500 text-slate-700 hover:text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No members found</h3>
            <p className="text-slate-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more members.'
                : 'No team members available.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}