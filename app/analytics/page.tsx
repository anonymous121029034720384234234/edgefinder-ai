'use client'

import { useState } from 'react'
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs'
import { Home, BarChart3, TrendingUp, Upload, Zap, Settings, LogOut, Menu, Bell, Download, CheckCircle2, ArrowRight, Sparkles, Target, Clock, Brain, TrendingDown } from 'lucide-react'
import UploadModal from '@/app/components/UploadModal'

export default function AnalyticsPage() {
  const { isLoaded: authLoaded } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0])
      setShowUploadModal(true)
    }
  }

  const uploadedFiles: any[] = []

  if (!authLoaded || !userLoaded) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const getUserInitials = () => {
    if (!user?.firstName && !user?.lastName) {
      return user?.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'
    }
    return ((user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')).toUpperCase()
  }

  const userName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'
  const userEmail = user?.emailAddresses[0]?.emailAddress || ''

  return (
    <div 
      className="min-h-screen bg-[#080808] flex"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        * {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
      `}</style>

      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-[#0a0a0a] border border-purple-500/30 text-center">
            <Upload className="w-14 h-14 mx-auto mb-4 text-purple-400" />
            <h2 className="text-xl font-bold text-white mb-2">Drop your file here</h2>
            <p className="text-sm text-gray-400 mb-6">CSV, XLSX, or XLS</p>
            
            <div className="space-y-3 bg-white/[0.03] rounded-lg p-4 border border-white/[0.05]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-300">Upload your trade history</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-300">Get instant performance analysis</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-300">Unlock your trading edge</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[180px]"
          style={{
            background: 'radial-gradient(circle, rgba(59,7,100,0.6) 0%, transparent 70%)',
            top: '-15%',
            right: '10%',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[160px]"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            bottom: '10%',
            left: '5%',
          }}
        />
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/[0.06] z-40 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col`}>
        
        <div className="h-16 px-6 flex items-center border-b border-white/[0.06]">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">Edge</span>
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
              }}
            >
              Finder
            </span>
            <span className="text-white text-sm ml-1.5 font-normal">AI</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white font-medium text-sm backdrop-blur-sm">
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <TrendingUp className="w-5 h-5" />
            <span>Trades</span>
          </a>
          <a href="/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </a>
          <div className="pt-1 mt-1">
            <a href="#" className="relative group block overflow-visible">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 rounded-lg opacity-50 group-hover:opacity-70 blur-sm transition-all duration-300"></div>
              <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black/90 border border-white/[0.15] group-hover:border-white/[0.25] transition-all backdrop-blur-sm">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">AI Assistant</span>
              </div>
            </a>
          </div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white font-semibold text-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Trades</span>
          </button>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={userName}
                    className="w-9 h-9 rounded-full"
                  />
                ) : (
                  getUserInitials()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{userName}</div>
                <div className="text-xs text-gray-500 truncate">{userEmail}</div>
              </div>
            </div>

            <SignOutButton>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all text-sm">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 transition-all relative flex flex-col h-screen">
        <div className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-30 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Analytics</h1>
              <p className="text-xs text-gray-500 mt-0.5">Deep insights into your trading performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex items-center justify-center p-6 md:p-8">
            {uploadedFiles.length === 0 ? (
              <div className="max-w-4xl w-full">
                {/* Hero Section */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-semibold text-purple-400">AI-Powered Analytics</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Discover Your{' '}
                    <span 
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
                      }}
                    >
                      Trading Edge
                    </span>
                  </h2>
                  
                  <p className="text-base text-gray-400 mb-7 max-w-2xl mx-auto leading-relaxed">
                    Upload your trade history and get comprehensive AI analysis in under 60 seconds. 
                    Identify patterns, optimize strategies, and understand what's working.
                  </p>

                  <div className="flex items-center justify-center gap-3 mb-10">
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/40 text-white font-bold transition-all"
                    >
                      <Upload className="w-5 h-5" />
                      Upload Trade History
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-white font-semibold transition-all">
                      <Download className="w-4 h-4" />
                      Download Template
                    </button>
                  </div>
                </div>

                {/* What You'll Get */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-5 text-center">What You'll Get</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Performance Metrics</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Win rate, P&L curves, drawdowns, and key performance indicators.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Time & Day Patterns</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Your most and least profitable trading times and days.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Edge Detection</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">AI identifies your strongest setups and highest probability patterns.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Behavioral Insights</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Detect revenge trading, FOMO, and other psychological patterns.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Emotional Control Score</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Rated on discipline, stop-loss adherence, and emotional patterns.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Risk Management Analysis</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Position sizing, risk-reward ratios, and drawdown evaluation.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-xs text-gray-500">
                    Supports CSV, XLSX, and XLS formats from any broker
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Your Uploads</h2>
                <div className="grid gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="bg-white/[0.05] border border-white/[0.06] rounded-lg p-6 hover:bg-white/[0.08] transition-all cursor-pointer group"
                    >
                      {/* File display code */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        uploadedFile={uploadedFile}
        onFileChange={setUploadedFile}
      />
    </div>
  )
}