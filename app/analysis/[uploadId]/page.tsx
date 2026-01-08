'use client'

import { useEffect, useState } from 'react'
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import {
  Home, BarChart3, TrendingUp, Upload, Zap, Settings, LogOut, Menu, Bell,
  Download, CheckCircle2, ArrowRight, Sparkles, Target, Clock, Brain,
  TrendingDown, FileText, Calendar, Hash, Loader2, ChevronRight, AlertCircle,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { Insights } from '@/lib/insightsCalculator'

export default function AnalysisPage() {
  const { isLoaded: authLoaded } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const params = useParams()
  const uploadId = params.uploadId as string

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<Insights | null>(null)
  const [uploadInfo, setUploadInfo] = useState<any>(null)

  useEffect(() => {
    if (userLoaded && uploadId) {
      fetchInsights()
    }
  }, [userLoaded, uploadId])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/uploads/${uploadId}/insights`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch insights')
      }

      const data = await response.json()
      setInsights(data.insights)
      setUploadInfo(data.upload)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

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
    <div className="min-h-screen bg-[#080808] flex">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        * {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
      `}</style>

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
          <a href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </a>
          <a href="/trades" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
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
              <h1 className="text-xl font-bold text-white">Trade Analysis</h1>
              <p className="text-xs text-gray-500 mt-0.5">{uploadInfo?.filename || 'Loading...'}</p>
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  <p className="text-gray-400">Analyzing your trades...</p>
                </div>
              </div>
            ) : error ? (
              <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-300 font-semibold mb-1">Error</h3>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            ) : insights ? (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Your Trading Insights</h2>
                    <p className="text-gray-400 text-sm">Analysis of {uploadInfo?.trade_count} trades</p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-semibold transition-all">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>

                {/* Overall Performance */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Performance Overview</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-400 mb-1">
                        {insights.overallPerformance.winRate.toFixed(1)}%
                      </div>
                      <div className="text-xs font-semibold text-gray-400 mb-2">Win Rate</div>
                      <div className="text-xs text-gray-500">
                        {insights.overallPerformance.winners}W / {insights.overallPerformance.losers}L
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                      <div className={`text-3xl font-bold mb-1 ${insights.overallPerformance.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${insights.overallPerformance.totalPnL.toLocaleString()}
                      </div>
                      <div className="text-xs font-semibold text-gray-400">Total P&L</div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-400 mb-1">
                        {insights.overallPerformance.profitFactor.toFixed(2)}
                      </div>
                      <div className="text-xs font-semibold text-gray-400">Profit Factor</div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <div className="text-xs font-semibold text-gray-400 mb-1">Avg Win/Loss</div>
                          <div className="text-green-400 font-bold text-sm">
                            ${insights.overallPerformance.averageWin.toFixed(0)}
                          </div>
                          <div className="text-red-400 font-bold text-sm">
                            ${insights.overallPerformance.averageLoss.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Patterns */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Time Patterns</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4" />
                        Best Time
                      </h4>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="font-semibold text-white mb-2">{insights.timePatterns.bestTimeOfDay.timeRange}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Win Rate</span>
                            <span className="text-green-400 font-semibold">{insights.timePatterns.bestTimeOfDay.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">P&L</span>
                            <span className="text-green-400 font-semibold">${insights.timePatterns.bestTimeOfDay.pnL.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4" />
                        Worst Time
                      </h4>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <div className="font-semibold text-white mb-2">{insights.timePatterns.worstTimeOfDay.timeRange}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Win Rate</span>
                            <span className="text-red-400 font-semibold">{insights.timePatterns.worstTimeOfDay.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">P&L</span>
                            <span className="text-red-400 font-semibold">${insights.timePatterns.worstTimeOfDay.pnL.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4" />
                        Best Day
                      </h4>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="font-semibold text-white mb-2">{insights.timePatterns.bestDayOfWeek.day}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Win Rate</span>
                            <span className="text-green-400 font-semibold">{insights.timePatterns.bestDayOfWeek.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">P&L</span>
                            <span className="text-green-400 font-semibold">${insights.timePatterns.bestDayOfWeek.pnL.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4" />
                        Worst Day
                      </h4>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <div className="font-semibold text-white mb-2">{insights.timePatterns.worstDayOfWeek.day}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Win Rate</span>
                            <span className="text-red-400 font-semibold">{insights.timePatterns.worstDayOfWeek.winRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">P&L</span>
                            <span className="text-red-400 font-semibold">${insights.timePatterns.worstDayOfWeek.pnL.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Holding Time Analysis */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Holding Time Analysis</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-2">Winners held avg</div>
                      <div className="text-2xl font-bold text-green-400">
                        {insights.holdingTimeAnalysis.avgWinnerHoldTime}
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-2">Losers held avg</div>
                      <div className="text-2xl font-bold text-red-400">
                        {insights.holdingTimeAnalysis.avgLoserHoldTime}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-yellow-200 text-sm">{insights.holdingTimeAnalysis.insight}</p>
                  </div>
                </div>

                {/* Risk Management Score */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Risk Management Score</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-4 mb-3">
                      <div className="text-4xl font-bold text-purple-400">
                        {insights.riskManagementScore.score}/10
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-purple-500 h-full transition-all"
                            style={{ width: `${insights.riskManagementScore.score * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-3">Strengths</h4>
                      <ul className="space-y-2">
                        {insights.riskManagementScore.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-3">Weaknesses</h4>
                      <ul className="space-y-2">
                        {insights.riskManagementScore.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Top Symbols */}
                {insights.topSymbols.length > 0 && (
                  <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Top Symbols</h3>
                    </div>

                    <div className="space-y-3">
                      {insights.topSymbols.map((symbol) => (
                        <div key={symbol.symbol} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-lg">{symbol.symbol}</div>
                            <div className="text-xs text-gray-500">{symbol.trades} trades</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white mb-1">{symbol.winRate.toFixed(1)}% Win</div>
                            <div className={`text-sm font-bold ${symbol.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ${symbol.totalPnL.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back Button */}
                <div className="flex gap-3">
                  <a
                    href="/analytics"
                    className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-semibold transition-all"
                  >
                    ← Back to Analytics
                  </a>
                </div>

                <div className="text-center text-xs text-gray-600 border-t border-white/[0.05] pt-6">
                  <p>These insights are calculated from your trade data without AI. Future updates will include AI-powered pattern analysis.</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
