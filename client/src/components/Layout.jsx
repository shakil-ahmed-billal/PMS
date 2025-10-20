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
  Briefcase
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">ProjectHub</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:bg-white/10 p-1 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          {navigation.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onPageChange(item.key)
                setSidebarOpen(false)
              }}
              className={`
                w-full flex items-center px-4 py-3 mb-2 text-left transition-all duration-200 rounded-xl group
                ${currentPage === item.key
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105'
                }
              `}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                currentPage === item.key ? 'scale-110' : 'group-hover:scale-110'
              }`} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-700">
          <div className="flex items-center mb-4 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{profile?.full_name}</p>
              <p className="text-xs text-gray-400 capitalize">{profile?.role}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
        {/* Top bar */}
        <div className="h-16 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 flex items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
              <p className="text-xs text-blue-600 capitalize font-medium">{profile?.role}</p>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}