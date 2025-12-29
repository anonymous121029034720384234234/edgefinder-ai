'use client';

import { useAuth, useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Upload, BarChart3, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/signin');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 overflow-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        * {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
      `}</style>

      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle, rgba(59,7,100,0.5) 0%, transparent 70%)',
            top: '-10%',
            right: '20%',
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
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
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Welcome, <span className="text-white font-semibold">{user?.firstName}</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-10 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-3 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Analyze your trades and discover your edge
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Upload Trades */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.12] transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Trades</h3>
              <p className="text-sm text-gray-500">
                Import your trading data and get instant analysis
              </p>
            </div>

            {/* View Analytics */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.12] transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">View Analytics</h3>
              <p className="text-sm text-gray-500">
                See detailed insights about your trading patterns
              </p>
            </div>

            {/* Settings */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.12] transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Settings</h3>
              <p className="text-sm text-gray-500">
                Manage your account preferences and profile
              </p>
            </div>
          </div>

          {/* Demo Section */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 border border-white/[0.08] backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">Get Started</h2>
            <p className="text-gray-400 mb-6">
              This is a sample dashboard. In a production app, you would see your uploaded trades, performance metrics, and detailed analytics here.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white font-semibold transition-all">
                Upload Your First Trade
              </button>
              <Link href="/" className="px-6 py-3 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white font-semibold transition-all">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
