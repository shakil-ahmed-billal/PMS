import React, { useState } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import AuthPage from './components/Auth/AuthPage'
import Layout from './components/Layout'
import LeaderDashboard from './components/Dashboard/LeaderDashboard'
import MemberDashboard from './components/Dashboard/MemberDashboard'
import ProjectsPage from './components/Projects/ProjectsPage'
import ReportsPage from './components/Reports/ReportsPage'
import ProfilePage from './components/Profile/ProfilePage'

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
        return profile.role === 'leader' ? <LeaderDashboard /> : <MemberDashboard />
      case 'projects':
        return <ProjectsPage />
      case 'reports':
        return profile.role === 'leader' ? <ReportsPage /> : <div>Access denied</div>
      case 'profile':
        return <ProfilePage />
      default:
        return profile.role === 'leader' ? <LeaderDashboard /> : <MemberDashboard />
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