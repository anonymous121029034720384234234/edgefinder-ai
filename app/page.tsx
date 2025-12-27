'use client';

import { useEffect, useState } from 'react';
import { Zap, Shield, Target, Briefcase, BarChart3, Link2, ArrowRight, TrendingUp, Users, Award, Clock } from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 overflow-hidden relative">
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

      {/* Header with unique asymmetric layout */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-lg shadow-purple-600/40"></div>
              <span className="text-xl font-bold tracking-tight text-white">EdgeFinder</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">Features</a>
              <a href="#social-proof" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">Traders</a>
              <a href="#how-it-works" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">Process</a>
              <a href="#pricing" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">Pricing</a>
              <div className="w-px h-5 bg-white/[0.06] mx-2"></div>
              <button className="ml-2 px-5 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-semibold transition-all">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Unique Hero Layout - Asymmetric Split with enhanced padding */}
      <section className="relative pt-32 pb-20 px-10 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-8">
                <TrendingUp className="w-3 h-3 text-purple-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI-Powered Trading</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                <span className="text-white">Trade with</span>
                <br />
                <span 
                  className="inline-block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f97316 50%, #eab308 75%, #a855f7 100%)',
                    backgroundSize: '200% auto',
                  }}
                >
                  Precision
                </span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-10 max-w-[500px] leading-relaxed">
                Advanced AI algorithms analyze market patterns in real-time, giving you the edge needed to execute winning trades consistently.
              </p>
              
              <div className="flex gap-3">
                <button className="group relative px-7 py-3.5 rounded-lg bg-white hover:bg-gray-100 text-black text-sm font-bold transition-all overflow-hidden">
                  <span className="relative z-10">Start Trading Now</span>
                </button>
                <button className="px-7 py-3.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white text-sm font-semibold transition-all backdrop-blur-sm">
                  View Demo
                </button>
              </div>
            </div>

            {/* Right - Minimalist Line Chart */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-emerald-600/5 rounded-2xl blur-3xl"></div>
              
              <div className="relative w-full p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
                {/* Chart Title & Description */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-white mb-2">Win Rate Over Time</h3>
                  <p className="text-xs text-gray-500">Average trader performance - consistent gains with our AI analysis</p>
                </div>

                {/* Minimalist Line Chart */}
                <div className="h-44 relative mb-6">
                  {/* SVG Line Chart */}
                  <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    
                    {/* Area under curve */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34,197,94,0.15)" />
                        <stop offset="100%" stopColor="rgba(34,197,94,0.01)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Fill area */}
                    <path d="M 0 110 Q 50 85, 100 75 T 200 50 T 300 45 T 400 40 L 400 160 L 0 160 Z" fill="url(#chartGradient)" />
                    
                    {/* Line with smooth curves */}
                    <path d="M 0 110 Q 50 85, 100 75 T 200 50 T 300 45 T 400 40" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-0.5">94.2%</div>
                    <p className="text-xs text-gray-500">Average Win Rate</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-0.5">3.42x</div>
                    <p className="text-xs text-gray-500">Profit Factor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="social-proof" className="relative py-20 px-10 lg:px-20 border-y border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center border border-white/[0.08]">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-0.5">12,500+</div>
                <div className="text-sm text-gray-500 font-medium">Active Traders</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600/20 to-orange-600/20 flex items-center justify-center border border-white/[0.08]">
                <Award className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-0.5">4.9/5.0</div>
                <div className="text-sm text-gray-500 font-medium">User Rating</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center border border-white/[0.08]">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-0.5">24/7</div>
                <div className="text-sm text-gray-500 font-medium">Market Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-10 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-3 text-white">
              Built for Performance
            </h2>
            <p className="text-gray-500 text-lg">Enterprise-grade tools for serious traders</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Real-Time Analysis',
                description: 'Lightning-fast market sentiment analysis with sub-50ms latency',
                icon: Zap,
                highlight: true
              },
              {
                title: 'Risk Management',
                description: 'Intelligent position sizing with advanced drawdown protection',
                icon: Shield
              },
              {
                title: 'Pattern Recognition',
                description: 'ML-powered pattern detection across multiple timeframes',
                icon: Target
              },
              {
                title: 'Multi-Asset Support',
                description: 'Unified interface for stocks, crypto, forex, and commodities',
                icon: Briefcase
              },
              {
                title: 'Backtesting Engine',
                description: 'Test strategies on decades of historical data instantly',
                icon: BarChart3,
                highlight: true
              },
              {
                title: 'API Integration',
                description: 'Direct connection to 50+ exchanges and brokers',
                icon: Link2
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`group relative p-7 rounded-xl backdrop-blur-sm transition-all cursor-pointer ${
                    feature.highlight
                      ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.15] hover:border-white/[0.25]'
                      : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  {feature.highlight && (
                    <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(249,115,22,0.1) 100%)',
                      }}
                    ></div>
                  )}
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${
                      feature.highlight
                        ? 'bg-white/[0.08] border border-white/[0.12]'
                        : 'bg-white/[0.04] border border-white/[0.06]'
                    }`}>
                      <Icon className="w-5 h-5 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-10 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-3 text-white">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg">Deploy in minutes, trade in seconds</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Connect Exchange',
                description: 'Secure API integration with encrypted key storage'
              },
              {
                step: '02',
                title: 'Configure Strategy',
                description: 'Set risk parameters and automated triggers'
              },
              {
                step: '03',
                title: 'Execute Trades',
                description: 'AI analyzes and executes in real-time'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-7 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all">
                <div className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-widest">{item.step}</div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Rainbow gradient highlight */}
      <section id="pricing" className="relative py-24 px-10 lg:px-20">
        <div className="max-w-[750px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3 text-white">
              Simple Pricing
            </h2>
            <p className="text-gray-500 text-lg">Professional-grade tools, one transparent price</p>
          </div>
          
          <div className="relative">
            {/* Rainbow glow effect */}
            <div 
              className="absolute -inset-1 rounded-2xl blur-xl opacity-40"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f97316 50%, #eab308 75%, #a855f7 100%)',
              }}
            ></div>
            
            <div className="relative p-12 rounded-xl bg-black/90 backdrop-blur-xl border border-white/[0.12]">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg mb-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.15) 50%, rgba(249,115,22,0.15) 100%)',
                    border: '1px solid rgba(168,85,247,0.3)',
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Launch Offer
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Pro Trader</h3>
                <p className="text-sm text-gray-500 mb-6">Everything you need to trade like a professional</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-white">$99</span>
                  <span className="text-gray-500 font-semibold">/month</span>
                </div>
              </div>
              
              <div className="space-y-3.5 mb-9">
                {[
                  'Unlimited trades across all assets',
                  'Real-time AI market analysis',
                  '24/7 priority support',
                  'Custom strategy builder',
                  'Full API access & webhooks',
                  'Multi-exchange integration'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-3.5 rounded-lg bg-white hover:bg-gray-100 text-black text-sm font-bold transition-all">
                Start Trading Now
              </button>
              
              <p className="text-center text-xs text-gray-600 mt-4">14-day money-back guarantee • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-10 lg:px-20">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-5xl font-bold mb-5 text-white">
            Ready to Gain Your Edge?
          </h2>
          <p className="text-lg text-gray-400 mb-9 max-w-[600px] mx-auto">
            Join 12,500+ traders making data-driven decisions with EdgeFinder AI
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white hover:bg-gray-100 text-black text-base font-bold transition-all">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.03] bg-black/40 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Docs</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Community</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Terms</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/[0.03] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">© 2025 EdgeFinder AI. All rights reserved.</div>
            <div className="flex gap-7">
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Discord</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}