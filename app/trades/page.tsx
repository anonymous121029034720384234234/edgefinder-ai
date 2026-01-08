'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs'
import { Home, BarChart3, TrendingUp, Upload, Zap, Settings, LogOut, Menu, Bell, Download, FileText, ChevronDown, Search, Filter, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatNumber } from '@/lib/formatters'

interface Trade {
  id: string
  symbol: string
  entry_price: number
  exit_price: number
  pnl: number
  quantity: number
  platform: string
  trade_date: string
}

export default function TradesPage() {
  const { isLoaded: authLoaded } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPnL, setFilterPnL] = useState<'all' | 'wins' | 'losses'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'pnl' | 'symbol'>('date')

  useEffect(() => {
    if (userLoaded && authLoaded) {
      fetchTrades()
    }
  }, [userLoaded, authLoaded])

  const fetchTrades = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/trades')
      
      if (!response.ok) {
        throw new Error('Failed to fetch trades')
      }

      const data = await response.json()
      setTrades(data.trades || [])
    } catch (error) {
      console.error('Error fetching trades:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrades = trades
    .filter(trade => {
      const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = 
        filterPnL === 'all' ? true :
        filterPnL === 'wins' ? trade.pnl > 0 :
        trade.pnl < 0
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime()
      }
      if (sortBy === 'pnl') {
        return b.pnl - a.pnl
      }
      return a.symbol.localeCompare(b.symbol)
    })

  const stats = {
    totalTrades: trades.length,
    totalPnL: trades.reduce((sum, t) => sum + t.pnl, 0),
    winningTrades: trades.filter(t => t.pnl > 0).length,
    losingTrades: trades.filter(t => t.pnl < 0).length,
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
    <div className="min-h-screen bg-black flex">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        * {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/[0.06] z-40 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col`}>
        
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
          <Link href="/trades" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white font-medium text-sm backdrop-blur-sm">
            <TrendingUp className="w-5 h-5" />
            <span>Trades</span>
          </Link>
          <Link href="/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all">
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </Link>
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

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/[0.06]">
          <Link href="/upload" className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white font-semibold text-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload Trades</span>
          </Link>

          {/* User Profile */}
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
        {/* Top Bar */}
        <div className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-30 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Trades</h1>
              <p className="text-xs text-gray-500 mt-0.5">View all your executed trades</p>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Total Trades</span>
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalTrades}</div>
                <p className="text-xs text-gray-500 mt-2">From all uploads</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Total P&L</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.totalPnL >= 0 ? '+' : ''}{formatCurrency(stats.totalPnL)}
                </div>
                <p className="text-xs text-gray-500 mt-2">{stats.totalPnL >= 0 ? 'Profit' : 'Loss'}</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Winning Trades</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.winningTrades}</div>
                <p className="text-xs text-gray-500 mt-2">{stats.totalTrades > 0 ? ((stats.winningTrades / stats.totalTrades) * 100).toFixed(1) : 0}% win rate</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Losing Trades</span>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.losingTrades}</div>
                <p className="text-xs text-gray-500 mt-2">{stats.totalTrades > 0 ? ((stats.losingTrades / stats.totalTrades) * 100).toFixed(1) : 0}% loss rate</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by symbol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/[0.12] transition-colors"
                  />
                </div>

                {/* Filter P&L */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={filterPnL}
                    onChange={(e) => setFilterPnL(e.target.value as 'all' | 'wins' | 'losses')}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white appearance-none focus:outline-none focus:border-white/[0.12] transition-colors cursor-pointer"
                  >
                    <option value="all" className="bg-black">All Trades</option>
                    <option value="wins" className="bg-black">Winning Trades</option>
                    <option value="losses" className="bg-black">Losing Trades</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <Download className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'pnl' | 'symbol')}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white appearance-none focus:outline-none focus:border-white/[0.12] transition-colors cursor-pointer"
                  >
                    <option value="date" className="bg-black">Newest First</option>
                    <option value="pnl" className="bg-black">Best P&L</option>
                    <option value="symbol" className="bg-black">Symbol A-Z</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Trades Table */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading trades...</p>
              </div>
            ) : filteredTrades.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No trades found</p>
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Symbol</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-400">Entry Price</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-400">Exit Price</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-400">Quantity</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-400">P&L</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Platform</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrades.map((trade) => (
                        <tr key={trade.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-white font-semibold">{trade.symbol}</td>
                          <td className="px-6 py-4 text-right text-gray-400">{formatCurrency(trade.entry_price)}</td>
                          <td className="px-6 py-4 text-right text-gray-400">{formatCurrency(trade.exit_price)}</td>
                          <td className="px-6 py-4 text-right text-gray-400">{formatNumber(trade.quantity)}</td>
                          <td className={`px-6 py-4 text-right font-semibold ${Number(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(trade.pnl) >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">{trade.platform}</td>
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {new Date(trade.trade_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Results Count */}
            {!loading && filteredTrades.length > 0 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {filteredTrades.length} of {stats.totalTrades} trades
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
