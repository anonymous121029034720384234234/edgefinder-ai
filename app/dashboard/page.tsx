'use client';

import { useState } from 'react';
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs';
import { Upload, TrendingUp, TrendingDown, BarChart3, Target, Shield, Zap, DollarSign, Percent, AlertTriangle, CheckCircle2, Home, LogOut, Settings, Menu, Download, FileText, PieChart, Calendar, BookOpen, Bell } from 'lucide-react';
import UploadModal from '@/app/components/UploadModal';

export default function Dashboard() {
  const { isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.firstName && !user?.lastName) {
      return user?.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || 'U';
    }
    return ((user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')).toUpperCase();
  };

  const userName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
  const userEmail = user?.emailAddresses[0]?.emailAddress || '';

  const pnlChartData = [
    { day: 1, pnl: 120, cumulative: 120 },
    { day: 2, pnl: -85, cumulative: 35 },
    { day: 3, pnl: 180, cumulative: 215 },
    { day: 4, pnl: -140, cumulative: 75 },
    { day: 5, pnl: 95, cumulative: 170 },
    { day: 6, pnl: -220, cumulative: -50 },
    { day: 7, pnl: 150, cumulative: 100 },
    { day: 8, pnl: 210, cumulative: 310 },
    { day: 9, pnl: -165, cumulative: 145 },
    { day: 10, pnl: 130, cumulative: 275 },
    { day: 11, pnl: -95, cumulative: 180 },
    { day: 12, pnl: 105, cumulative: 285 },
    { day: 13, pnl: -180, cumulative: 105 },
    { day: 14, pnl: 175, cumulative: 280 },
    { day: 15, pnl: -210, cumulative: 70 },
    { day: 16, pnl: 85, cumulative: 155 },
    { day: 17, pnl: 195, cumulative: 350 },
    { day: 18, pnl: -130, cumulative: 220 },
    { day: 19, pnl: 140, cumulative: 360 },
    { day: 20, pnl: -175, cumulative: 185 },
    { day: 21, pnl: 125, cumulative: 310 },
    { day: 22, pnl: 165, cumulative: 475 },
    { day: 23, pnl: -95, cumulative: 380 },
    { day: 24, pnl: 110, cumulative: 490 },
    { day: 25, pnl: -140, cumulative: 350 },
    { day: 26, pnl: 185, cumulative: 535 },
    { day: 27, pnl: -120, cumulative: 415 },
    { day: 28, pnl: 205, cumulative: 620 },
    { day: 29, pnl: 75, cumulative: 695 },
    { day: 30, pnl: -105, cumulative: 590 },
  ];

  const maxCumulative = Math.max(...pnlChartData.map(d => d.cumulative));
  const minCumulative = Math.min(...pnlChartData.map(d => d.cumulative));
  const range = maxCumulative - minCumulative;

  // Calculate dynamic y-axis intervals
  const calculateNiceInterval = (range: number) => {
    if (range === 0) return 100;
    const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
    const normalized = range / magnitude;
    
    if (normalized < 1.5) return magnitude * 0.2;
    if (normalized < 3) return magnitude * 0.5;
    if (normalized < 7) return magnitude;
    return magnitude * 2;
  };

  const interval = calculateNiceInterval(range);
  const minLabel = Math.floor(minCumulative / interval) * interval;
  const maxLabel = Math.ceil(maxCumulative / interval) * interval;
  const labelRange = maxLabel - minLabel;
  const gridCount = Math.round(labelRange / interval);

  const getY = (value: number) => {
    const topPadding = 12;
    const chartHeight = 300 - topPadding;
    const adjustedMin = minLabel;
    const adjustedRange = labelRange || range;
    return topPadding + chartHeight - ((value - adjustedMin) / adjustedRange) * chartHeight;
  };

  // Generate smooth bezier curve path with proper bidirectional smoothing
  const generateSmoothPath = (data: typeof pnlChartData) => {
    if (data.length < 2) return '';
    
    const points = data.map((d, i) => ({
      x: 55 + (i * 1180) / (data.length - 1),
      y: getY(d.cumulative)
    }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      // Calculate tangent vectors for smooth transitions in both directions
      let cp1x, cp1y, cp2x, cp2y;

      if (i === 1) {
        // First segment: use simple approach
        cp1x = prev.x + (curr.x - prev.x) * 0.4;
        cp1y = prev.y + (curr.y - prev.y) * 0.4;
      } else {
        // Use previous and current points to calculate first control point
        const prevPrev = points[i - 2];
        const slope = (curr.y - prevPrev.y) / (curr.x - prevPrev.x);
        cp1x = prev.x + (curr.x - prev.x) * 0.4;
        cp1y = prev.y + slope * (curr.x - prev.x) * 0.4;
      }

      if (i === points.length - 1) {
        // Last segment: use simple approach
        cp2x = curr.x - (curr.x - prev.x) * 0.4;
        cp2y = curr.y - (curr.y - prev.y) * 0.4;
      } else {
        // Use current and next points to calculate second control point
        const slope = (next.y - prev.y) / (next.x - prev.x);
        cp2x = curr.x - (next.x - curr.x) * 0.4;
        cp2y = curr.y - slope * (next.x - curr.x) * 0.4;
      }

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  const recentTrades = [
    { symbol: 'TSLA', pnl: '+$570', result: 'win', time: '10:34 AM', winRate: '73%' },
    { symbol: 'NVDA', pnl: '-$320', result: 'loss', time: '2:15 PM', winRate: '58%' },
    { symbol: 'AAPL', pnl: '+$800', result: 'win', time: '9:47 AM', winRate: '81%' },
    { symbol: 'SPY', pnl: '+$425', result: 'win', time: '11:22 AM', winRate: '67%' },
    { symbol: 'MSFT', pnl: '-$180', result: 'loss', time: '3:05 PM', winRate: '62%' },
  ];

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      setShowUploadModal(true);
    }
  };

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
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white font-medium text-sm backdrop-blur-sm">
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

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white font-semibold text-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Trades</span>
          </button>

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
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-xs text-gray-500 mt-0.5">Track your trading performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Dashboard Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2.5 py-1.5 max-w-[1600px]">
          
          {/* Top Row: Stats + Chart */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            
            {/* Stats Cards */}
            <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-2">
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3 py-2 hover:border-white/[0.12] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total P&L</span>
                  <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5 text-green-400" />
                  </div>
                </div>
                <div className="text-xl font-bold text-white">$590</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-medium text-green-400">+2.4%</span>
                  <span className="text-xs text-gray-600 ml-1">this month</span>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3 py-2 hover:border-white/[0.12] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Win Rate</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Percent className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
                <div className="text-xl font-bold text-white">47%</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs font-medium text-gray-400">14W / 16L</span>
                  <span className="text-xs text-gray-600 ml-1">30 trades</span>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3 py-2 hover:border-white/[0.12] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Win</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
                <div className="text-xl font-bold text-white">+$155</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-gray-400">Per winner</span>
                  <span className="text-xs text-gray-600 ml-1">1.1x loss</span>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3 py-2 hover:border-white/[0.12] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Loss</span>
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  </div>
                </div>
                <div className="text-xl font-bold text-white">-$142</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-gray-400">Per loser</span>
                  <span className="text-xs text-gray-600 ml-1">learning</span>
                </div>
              </div>
            </div>

            {/* P&L Chart - Trader-Focused */}
            <div className="col-span-12 lg:col-span-8 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3 py-1 hover:border-white/[0.12] transition-all">
              <div className="flex items-center justify-between mb-2 px-1">
                <div>
                  <h3 className="text-sm font-semibold text-white">Cumulative P&L</h3>
                  <p className="text-xs text-gray-600 mt-0.5">30 Day Performance</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ${hoveredDay !== null 
                      ? pnlChartData[hoveredDay].cumulative.toLocaleString() 
                      : pnlChartData[pnlChartData.length - 1].cumulative.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">
                    {hoveredDay !== null 
                      ? `Day ${pnlChartData[hoveredDay].day} • PnL: ${pnlChartData[hoveredDay].pnl >= 0 ? '+' : ''}$${pnlChartData[hoveredDay].pnl.toLocaleString()}`
                      : `MTD Return: +${((pnlChartData[pnlChartData.length - 1].cumulative / pnlChartData[0].cumulative - 1) * 100).toFixed(1)}%`}
                  </p>
                </div>
              </div>
              
              <div className="relative" style={{ height: '200px' }}>
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 1250 328" 
                  preserveAspectRatio="xMidYMid meet"
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <defs>
                    <linearGradient id="areaFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glowEffect">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Drawdown visualization background */}
                  <rect
                    x="55"
                    y="12"
                    width="1180"
                    height="300"
                    fill="rgba(0,0,0,0.2)"
                    rx="2"
                  />
                  
                  {/* Grid lines - horizontal with trader-focused styling */}
                  {Array.from({ length: gridCount + 1 }, (_, i) => {
                    const value = minLabel + (i * interval);
                    const y = getY(value);
                    const isZeroLine = Math.abs(value) < interval / 2;
                    const isFirstLine = i === 0;
                    
                    return (
                      <g key={i}>
                        <line 
                          x1="55" 
                          y1={y} 
                          x2="1235" 
                          y2={y} 
                          stroke={isZeroLine ? "rgba(16,185,129,0.15)" : isFirstLine ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.04)"} 
                          strokeWidth="1"
                        />
                        <text 
                          x="48" 
                          y={y + 3.5} 
                          fill={isZeroLine ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.35)"} 
                          fontSize="13.5" 
                          fontFamily="Space Grotesk"
                          fontWeight={isZeroLine ? "600" : "400"}
                          textAnchor="end"
                        >
                          ${value.toLocaleString()}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Vertical grid lines with subtle emphasis */}
                  {[0, 5, 10, 15, 20, 25, 29].map((day) => {
                    const i = day;
                    const x = 55 + ((i * 1180) / (pnlChartData.length - 1));
                    return (
                      <g key={day}>
                        <line
                          x1={x}
                          y1="12"
                          x2={x}
                          y2="312"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y="323"
                          fill="rgba(255,255,255,0.35)"
                          fontSize="13.5"
                          fontFamily="Space Grotesk"
                          fontWeight="400"
                          textAnchor="middle"
                        >
                          {day + 1}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Area fill with enhanced gradient - using smooth curves */}
                  <path
                    d={(() => {
                      const smoothPath = generateSmoothPath(pnlChartData);
                      return `${smoothPath} L 1235 312 L 55 312 Z`;
                    })()}
                    fill="url(#areaFill)"
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(16, 185, 129, 0.1))' }}
                  />
                  
                  {/* Main line segments with color based on PnL - smooth transitions */}
                  {pnlChartData.map((d, i) => {
                    if (i === 0) return null;
                    
                    const prev = pnlChartData[i - 1];
                    const curr = pnlChartData[i];
                    const next = pnlChartData[i + 1];
                    
                    // Determine color based on current PnL
                    const color = curr.pnl < 0 ? '#ef4444' : '#10b981';
                    const glow = curr.pnl < 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)';
                    
                    // Generate segment path
                    let cp1x, cp1y, cp2x, cp2y;
                    const prevX = 55 + ((i - 1) * 1180) / (pnlChartData.length - 1);
                    const prevY = getY(prev.cumulative);
                    const currX = 55 + (i * 1180) / (pnlChartData.length - 1);
                    const currY = getY(curr.cumulative);
                    
                    if (i === 1) {
                      cp1x = prevX + (currX - prevX) * 0.4;
                      cp1y = prevY + (currY - prevY) * 0.4;
                    } else {
                      const prevPrev = pnlChartData[i - 2];
                      const prevPrevX = 55 + ((i - 2) * 1180) / (pnlChartData.length - 1);
                      const prevPrevY = getY(prevPrev.cumulative);
                      const slope = (currY - prevPrevY) / (currX - prevPrevX);
                      cp1x = prevX + (currX - prevX) * 0.4;
                      cp1y = prevY + slope * (currX - prevX) * 0.4;
                    }

                    if (i === pnlChartData.length - 1) {
                      cp2x = currX - (currX - prevX) * 0.4;
                      cp2y = currY - (currY - prevY) * 0.4;
                    } else {
                      const nextX = 55 + ((i + 1) * 1180) / (pnlChartData.length - 1);
                      const nextY = getY(next.cumulative);
                      const slope = (nextY - prevY) / (nextX - prevX);
                      cp2x = currX - (nextX - currX) * 0.4;
                      cp2y = currY - slope * (nextX - currX) * 0.4;
                    }
                    
                    const pathD = `M ${prevX} ${prevY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
                    
                    return (
                      <path
                        key={i}
                        d={pathD}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
                      />
                    );
                  })}
                  
                  {/* Interactive elements with trader-focused feedback */}
                  {pnlChartData.map((d, i) => {
                    const x = 55 + (i * 1180) / (pnlChartData.length - 1);
                    const y = getY(d.cumulative);
                    const isHovered = hoveredDay === i;
                    
                    return (
                      <g key={i}>
                        {/* Crosshair on hover with professional styling */}
                        {isHovered && (
                          <>
                            <line
                              x1={x}
                              y1="12"
                              x2={x}
                              y2="312"
                              stroke="rgba(16, 185, 129, 0.35)"
                              strokeWidth="1.8"
                              strokeDasharray="5 3"
                            />
                            <line
                              x1="55"
                              y1={y}
                              x2="1235"
                              y2={y}
                              stroke="rgba(16, 185, 129, 0.35)"
                              strokeWidth="1.8"
                              strokeDasharray="5 3"
                            />
                          </>
                        )}
                        
                        {/* Invisible hover area - larger for better UX */}
                        <rect
                          x={x - 17}
                          y="0"
                          width="34"
                          height="328"
                          fill="transparent"
                          style={{ cursor: 'crosshair' }}
                          onMouseEnter={() => setHoveredDay(i)}
                        />
                        
                        {/* Data point - only show on hover */}
                        {isHovered && (
                          <circle
                            cx={x}
                            cy={y}
                            r={5.5}
                            fill="#10b981"
                            stroke="#fff"
                            strokeWidth="2.8"
                            style={{ 
                              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.7))'
                            }}
                          />
                        )}
                        
                        {/* Drawdown markers - removed, now shown in line color */}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Middle Row: Insights */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            
            {/* Your Edge */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.12] rounded-xl px-3 py-3 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4.5 h-4.5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-green-400/80 uppercase tracking-widest mb-0.5">Your Biggest Edge</div>
                    <div className="text-sm text-gray-200 font-medium leading-tight">Morning trades (9:30-10:30 AM)</div>
                  </div>
                </div>
                <div className="mt-0.5 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2.5xl font-bold text-green-400">78%</div>
                    <div className="text-xs text-green-400/70 font-semibold">win rate</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg px-2.5 py-1.5 border border-white/[0.06]">
                    <div className="text-xs text-green-400 font-semibold">+$2,104 profit</div>
                    <div className="text-xs text-gray-500 mt-0.5">27% above average</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biggest Leak */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.12] rounded-xl px-3 py-3 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-red-400/80 uppercase tracking-widest mb-0.5">Your Biggest Leak</div>
                    <div className="text-sm text-gray-200 font-medium leading-tight">Hold losers 3.2x longer than winners</div>
                  </div>
                </div>
                <div className="mt-0.5 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2.5xl font-bold text-red-400">7.8h</div>
                    <div className="text-xs text-red-400/70 font-semibold">avg hold</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg px-2.5 py-1.5 border border-white/[0.06]">
                    <div className="text-xs text-red-400 font-semibold">-$1,840 cost</div>
                    <div className="text-xs text-gray-500 mt-0.5">Cut at 2.5h to save $1.2K</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="col-span-12 lg:col-span-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3 py-2 hover:border-white/[0.12] transition-all">
              <h4 className="text-sm font-bold text-white mb-2.5">Recent Trades</h4>
              <div className="space-y-1.5">
                {recentTrades.slice(0, 4).map((trade, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${trade.result === 'win' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-sm font-semibold text-white">{trade.symbol}</span>
                      <span className="text-xs text-gray-500">{trade.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{trade.winRate}</span>
                      <div className={`text-sm font-bold ${trade.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.pnl}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Detailed Analysis */}
          <div className="grid grid-cols-12 gap-2">
            
            {/* Time Patterns */}
            <div className="col-span-12 lg:col-span-6 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3.5 py-2 hover:border-white/[0.12] transition-all">
              <h3 className="text-base font-bold text-white mb-2.5">Time & Day Patterns</h3>
              
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">Best Time</div>
                  <div className="font-semibold text-white text-sm mb-1">9:30 - 10:30 AM</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Win Rate:</span>
                    <span className="text-sm font-bold text-green-400">71%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">$2.1K profit</div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Worst Time</div>
                  <div className="font-semibold text-white text-sm mb-1">2:00 - 4:00 PM</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Win Rate:</span>
                    <span className="text-sm font-bold text-red-400">41%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">-$890 loss</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 backdrop-blur-sm">
                  <div className="text-xs text-gray-500 mb-0.5">Best Day</div>
                  <div className="font-bold text-white text-sm mb-0.5">Tuesday</div>
                  <div className="text-xs text-green-400 font-medium">67% win rate</div>
                  <div className="text-xs text-gray-600 mt-0.5">+$1.3K avg</div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 backdrop-blur-sm">
                  <div className="text-xs text-gray-500 mb-0.5">Worst Day</div>
                  <div className="font-bold text-white text-sm mb-0.5">Friday</div>
                  <div className="text-xs text-red-400 font-medium">38% win rate</div>
                  <div className="text-xs text-gray-600 mt-0.5">-$740 avg</div>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-2">
              {/* Emotional Control Score */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3.5 py-2 hover:border-white/[0.12] transition-all cursor-pointer group">
                {/* Header */}
                <div className="flex items-start justify-between mb-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Emotional Control</h3>
                    <p className="text-xs text-gray-500">Discipline & patience</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-wide">Fair</span>
                  </div>
                </div>

                {/* Score Display with Progress Bar */}
                <div className="mb-3.5">
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-5xl font-bold text-purple-400">6.5</div>
                    <div className="text-lg text-gray-500">/10</div>
                  </div>
                  <div className="bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-lg font-bold text-red-400">23%</div>
                    <div className="text-xs text-gray-500 mt-1">Revenge</div>
                  </div>
                  <div className="text-center py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-lg font-bold text-red-400">17%</div>
                    <div className="text-xs text-gray-500 mt-1">Stop Break</div>
                  </div>
                  <div className="text-center py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-lg font-bold text-yellow-400">19%</div>
                    <div className="text-xs text-gray-500 mt-1">FOMO</div>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-gray-500">Main issue</span>
                  <span className="text-xs font-semibold text-red-400">Revenge trading after losses</span>
                </div>
              </div>

              {/* Risk Management Score */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl px-3.5 py-2 hover:border-white/[0.12] transition-all cursor-pointer group">
                {/* Header */}
                <div className="flex items-start justify-between mb-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Risk Management</h3>
                    <p className="text-xs text-gray-500">Position & stops</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Good</span>
                  </div>
                </div>

                {/* Score Display with Progress Bar */}
                <div className="mb-3.5">
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-5xl font-bold text-blue-400">7.0</div>
                    <div className="text-lg text-gray-500">/10</div>
                  </div>
                  <div className="bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: '70%' }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-lg font-bold text-green-400">2.0%</div>
                    <div className="text-xs text-gray-500 mt-1">Position</div>
                  </div>
                  <div className="text-center py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-lg font-bold text-green-400">1:2.3</div>
                    <div className="text-xs text-gray-500 mt-1">R:R Ratio</div>
                  </div>
                  <div className="text-center py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-lg font-bold text-yellow-400">8.3%</div>
                    <div className="text-xs text-gray-500 mt-1">Max DD</div>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-gray-500">Focus area</span>
                  <span className="text-xs font-semibold text-green-400">Maintain stop discipline</span>
                </div>
              </div>
            </div>
          </div>
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
  );
}