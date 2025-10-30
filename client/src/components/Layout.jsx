import React, { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Menu,
  X,
  Plus,
  CheckSquare,
  Users,
  UserCheck,
  Briefcase,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children, currentPage, onPageChange }) {
  const { profile, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
    ...(profile?.role === 'Member' ? [
      { name: 'Add Task', icon: Plus, key: 'add-task' },
      { name: 'All Tasks', icon: CheckSquare, key: 'all-tasks' },
      { name: 'Projects', icon: FolderOpen, key: 'projects' },
    ] : []),
    ...(profile?.role === 'Leader' ? [
      { name: 'All Members', icon: Users, key: 'all-members' },
      { name: 'Member Info', icon: UserCheck, key: 'member-info' },
      { name: 'All Projects', icon: Briefcase, key: 'all-projects' },
      { name: 'Reports', icon: BarChart3, key: 'reports' },
    ] : []),
    { name: 'Profile', icon: Settings, key: 'profile' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-gray-200/50
      `}>
        {/* Sidebar Header */}
        <div className="relative h-20 px-6 flex items-center justify-between bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">ProjectHub</h1>
              <p className="text-xs text-blue-100">Workspace Manager</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden relative hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-240px)]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Navigation</p>
          {navigation.map((item) => {
            const isActive = currentPage === item.key
            return (
              <button
                key={item.key}
                onClick={() => {
                  onPageChange(item.key)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center px-4 py-3.5 text-left transition-all duration-200 rounded-xl group relative overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-indigo-600'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                )}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 shadow-inner' 
                    : 'bg-gray-100 group-hover:bg-indigo-100 group-hover:scale-110'
                  }
                `}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'}`} />
                </div>
                <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent border-t border-gray-200/50">
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-3 border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{profile?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5"></span>
                  {profile?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group border border-gray-200 hover:border-red-200"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Workspace</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-700 capitalize">{profile?.role} Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              <div className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 rounded-xl border border-indigo-100">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
                  <p className="text-xs text-indigo-600 capitalize font-medium">{profile?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}