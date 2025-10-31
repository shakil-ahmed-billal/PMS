import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { demoUsers } from '../../lib/demoData'
import { User, Mail, Shield, Calendar, Save, Award, Activity, TrendingUp, Clock, CheckCircle, Sparkles, Crown, Star, Target } from 'lucide-react'

export default function ProfilePage() {
  const { profile, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || ''
  })

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!profile?.id) return

    setLoading(true)
    setMessage('')

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = demoUsers.findIndex(u => u.id === profile.id)
      if (index > -1) {
        demoUsers[index] = {
          ...demoUsers[index],
          full_name: formData.full_name,
          email: formData.email
        }
        
        localStorage.setItem('demo-user', JSON.stringify(demoUsers[index]))
      }

      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10  mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Header */}
     

        {/* Success Message */}
        {message && (
          <div className=" mx-auto mb-8 animate-slideDown">
            <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${
              message.includes('Error') 
                ? 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500' 
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500'
            }`}>
              <div className="relative p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                  {message.includes('Error') ? (
                    <Activity className="w-8 h-8 text-white" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  mx-auto">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Account Overview
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-700">User ID</span>
                    <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs font-mono text-slate-600 truncate">{profile.id}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700">Account Type</span>
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-lg font-bold text-emerald-900 capitalize">{profile.role}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Last Login</span>
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-semibold text-purple-900">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Member</h3>
                <p className="text-sm text-amber-50 leading-relaxed">
                  You have full access to all features and benefits of the platform
                </p>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Activity Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Profile Views</span>
                  <span className="text-lg font-bold text-slate-900">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Tasks Completed</span>
                  <span className="text-lg font-bold text-slate-900">56</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Projects Created</span>
                  <span className="text-lg font-bold text-slate-900">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Form Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-8 py-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                    <p className="text-blue-100 text-sm mt-1">Update your account information</p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <label htmlFor="full_name" className="block text-sm font-bold text-slate-900 mb-3">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
                        placeholder="Enter your full name"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-3">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900"
                        placeholder="your.email@example.com"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Read-only Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Role */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        Account Role
                      </label>
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-lg font-bold text-indigo-900 capitalize">{profile.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-3">
                        Member Since
                      </label>
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-emerald-900">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Sparkles className="w-4 h-4" />
                  <span>Changes will be saved to your account</span>
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Account Security</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Your account is protected with advanced security measures</p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Account</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Your email has been verified and your account is active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}