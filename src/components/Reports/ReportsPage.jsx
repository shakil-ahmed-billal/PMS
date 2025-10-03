import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProjectsWithProfiles } from '../../lib/demoData';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  Download
} from 'lucide-react';

export default function ReportsPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [memberStats, setMemberStats] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (profile?.role === 'leader') {
      loadReportsData();
    }
  }, [profile, selectedMonth, selectedYear]);

  const loadReportsData = async () => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const projectsData = getAllProjectsWithProfiles();

      setProjects(projectsData);

      // Calculate member statistics
      const membersMap = new Map();

      projectsData.forEach(project => {
        if (!project.profiles) return;
        
        const memberId = project.profiles.id;
        const memberName = project.profiles.full_name;
        const memberEmail = project.profiles.email;

        if (!membersMap.has(memberId)) {
          membersMap.set(memberId, {
            member_id: memberId,
            member_name: memberName,
            member_email: memberEmail,
            total_projects: 0,
            completed_projects: 0,
            total_amount: 0,
            completed_amount: 0,
            average_progress: 0
          });
        }

        const memberStat = membersMap.get(memberId);
        memberStat.total_projects++;
        memberStat.total_amount += project.amount || 0;

        if (project.status === 'completed') {
          memberStat.completed_projects++;
          memberStat.completed_amount += project.amount || 0;
        }
      });

      // Calculate average progress
      membersMap.forEach((memberStat, memberId) => {
        const memberProjects = projectsData.filter(p => p.profiles.id === memberId);
        const totalProgress = memberProjects.reduce((sum, p) => sum + p.progress, 0);
        memberStat.average_progress = memberProjects.length > 0 ? Math.round(totalProgress / memberProjects.length) : 0;
      });

      setMemberStats(Array.from(membersMap.values()));

      // Calculate monthly data
      const monthlyMap = new Map();
      
      projectsData.forEach(project => {
        const createdDate = new Date(project.created_at);
        const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            month: monthKey,
            total_projects: 0,
            completed_projects: 0,
            total_amount: 0,
            completed_amount: 0
          });
        }

        const monthData = monthlyMap.get(monthKey);
        monthData.total_projects++;
        monthData.total_amount += project.amount || 0;

        if (project.status === 'completed') {
          monthData.completed_projects++;
          monthData.completed_amount += project.amount || 0;
        }
      });

      const sortedMonthlyData = Array.from(monthlyMap.values())
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12); // Last 12 months

      setMonthlyData(sortedMonthlyData);

    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalStats = () => {
    return {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalAmount: projects.reduce((sum, p) => sum + (p.amount || 0), 0),
      completedAmount: projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0),
      totalMembers: memberStats.length
    };
  };

  if (profile?.role !== 'leader') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Access denied. This page is only available for leaders.</p>
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

  const totalStats = getTotalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Performance insights and team delivery reports</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.completedProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalStats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalStats.completedAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalMembers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Monthly Performance</h2>
        </div>
        <div className="p-6">
          {monthlyData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available for monthly performance
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {monthlyData.map((month) => (
                <div key={month.month} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects:</span>
                      <span className="font-medium">{month.total_projects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-green-600">{month.completed_projects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium">{formatCurrency(month.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivered:</span>
                      <span className="font-medium text-green-600">{formatCurrency(month.completed_amount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Member Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Member Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivered Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberStats.map((member) => {
                const completionRate = member.total_projects > 0 ? Math.round((member.completed_projects / member.total_projects) * 100) : 0;
                const deliveryRate = member.total_amount > 0 ? Math.round((member.completed_amount / member.total_amount) * 100) : 0;
                
                return (
                  <tr key={member.member_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.member_name}</div>
                        <div className="text-sm text-gray-500">{member.member_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.total_projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.completed_projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(member.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{formatCurrency(member.completed_amount)}</div>
                        <div className="text-xs text-gray-500">{deliveryRate}% of total</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${member.average_progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{member.average_progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {memberStats.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No member data available.
          </div>
        )}
      </div>
    </div>
  );
}
