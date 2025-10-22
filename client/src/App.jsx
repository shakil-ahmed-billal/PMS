import React, { useState } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import AuthPage from './components/Auth/AuthPage'
import Layout from './components/Layout'
import LeaderDashboard from './components/Dashboard/LeaderDashboard'
import MemberDashboard from './components/Dashboard/MemberDashboard'
import ProjectsPage from './components/Projects/ProjectsPage'
import ReportsPage from './components/Reports/ReportsPage'
import ProfilePage from './components/Profile/ProfilePage'
import AllMembersPage from './components/Members/AllMembersPage'
import MemberInfoPage from './components/Members/MemberInfoPage'
import AddTaskPage from './components/Tasks/AddTaskPage'
import AllTasksPage from './components/Tasks/AllTasksPage'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return <AuthPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return profile.role === 'Leader' ? <LeaderDashboard /> : <MemberDashboard />
      case 'add-task':
        return profile.role === 'Member' ? <AddTaskPage /> : <div>Access denied</div>
      case 'all-tasks':
        return profile.role === 'Member' ? <AllTasksPage /> : <div>Access denied</div>
      case 'projects':
        return profile.role === 'Member' ? <ProjectsPage /> : <div>Access denied</div>
      case 'all-members':
        return profile.role === 'Leader' ? <AllMembersPage /> : <div>Access denied</div>
      case 'member-info':
        return profile.role === 'Leader' ? <MemberInfoPage /> : <div>Access denied</div>
      case 'all-projects':
        return profile.role === 'Leader' ? <ProjectsPage /> : <div>Access denied</div>
      case 'reports':
        return profile.role === 'Leader' ? <ReportsPage /> : <div>Access denied</div>
      case 'profile':
        return <ProfilePage />
      default:
        return profile.role === 'Leader' ? <LeaderDashboard /> : <MemberDashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App