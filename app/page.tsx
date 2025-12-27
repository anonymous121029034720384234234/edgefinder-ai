'use client';

import { useEffect, useState } from 'react';
import { Zap, Shield, Target, Briefcase, BarChart3, Link2, ArrowRight, TrendingUp, Users, Award, Clock, Menu, X, Upload, Brain, FileText, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      {/* Enhanced Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20">
          <div className="flex items-center justify-between h-20">
            {/* Redesigned Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-lg shadow-purple-600/30 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
                </div>
              </div>
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
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">How It Works</a>
              <a href="#pricing" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">Pricing</a>
              <a href="#" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">Login</a>
              <div className="w-px h-5 bg-white/[0.06] mx-2"></div>
              <button className="ml-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white text-sm font-semibold transition-all">
                Start Free Trial
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.03] bg-black/95 backdrop-blur-xl">
            <div className="max-w-[1600px] mx-auto px-10 py-6 space-y-1">
              <a href="#features" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all font-medium">Features</a>
              <a href="#how-it-works" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all font-medium">How It Works</a>
              <a href="#pricing" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all font-medium">Pricing</a>
              <a href="#" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all font-medium">Login</a>
              <button className="w-full mt-4 px-5 py-3 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white text-sm font-semibold transition-all">
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Layout */}
      <section className="relative pt-32 pb-20 px-10 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Content */}
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                <span className="text-white">Stop Guessing.</span>
                <br />
                <span 
                  className="inline-block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f97316 50%, #eab308 75%, #a855f7 100%)',
                    backgroundSize: '200% auto',
                  }}
                >
                  Start Winning.
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-3 max-w-[540px] leading-relaxed font-semibold">
                Algorithmic Trade Analysis Engine That Finds Your Edge in 60 Seconds
              </p>
              
              <p className="text-base text-gray-500 mb-10 max-w-[540px] leading-relaxed">
                Upload your trades, get statistically-backed insights on your patterns, mistakes, and hidden edges—powered by 7 proprietary algorithms and machine learning. No complex setup. No overwhelming dashboards. Just actionable intelligence.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button className="group relative px-7 py-3.5 rounded-lg bg-white hover:bg-gray-100 text-black text-sm font-bold transition-all overflow-hidden">
                  <span className="relative z-10">Start Free 7-Day Trial →</span>
                </button>
                <button className="px-7 py-3.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white text-sm font-semibold transition-all backdrop-blur-sm">
                  View Demo
                </button>
              </div>

              {/* Trust indicators below CTA */}
              <div className="flex flex-col gap-2 mt-8 pt-8 border-t border-white/[0.06]">
                <span className="text-sm text-gray-500">No credit card required • Analyze up to 100 trades free • Cancel anytime</span>
                <span className="text-sm text-gray-400">Trusted by 2,000+ active traders • 4.8/5 rating</span>
              </div>
            </div>

            {/* Right - Enhanced Chart */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-emerald-600/5 rounded-2xl blur-3xl"></div>
              
              <div className="relative w-full p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
                {/* Chart Title & Description */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-white mb-2">Performance Analysis</h3>
                  <p className="text-xs text-gray-500">7 proprietary algorithms analyzing your edge</p>
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
                    <div className="text-2xl font-bold text-green-400 mb-0.5">60 sec</div>
                    <p className="text-xs text-gray-500">Analysis Time</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-0.5">7 Algorithms</div>
                    <p className="text-xs text-gray-500">Pattern Detection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Testimonials */}
      <section id="social-proof" className="relative py-20 px-10 lg:px-20 border-y border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            Traders Are Finding Edges They Never Knew They Had
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.10] transition-all">
              <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">
                "I discovered I lose 80% of my Friday trades. Been trading for 3 years and never noticed this pattern. EdgeFinder found it in 60 seconds. Now I just don't trade Fridays. Game changer."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-white/[0.08]"></div>
                <div>
                  <div className="text-sm font-semibold text-white">Mike T.</div>
                  <div className="text-xs text-gray-500">Day Trader, +$12K improvement in 60 days</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.10] transition-all">
              <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">
                "The hold time analysis blew my mind. I was holding losers 4x longer than winners. Fixed that one thing and my profit factor jumped from 1.3 to 2.1 in a month."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600/20 to-orange-600/20 border border-white/[0.08]"></div>
                <div>
                  <div className="text-sm font-semibold text-white">Sarah K.</div>
                  <div className="text-xs text-gray-500">Swing Trader, Previously down $8K, now up $15K</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.10] transition-all">
              <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">
                "Finally, something that actually helps instead of just tracking. The emotional trading score called me out hard—I was revenge trading after every loss. Awareness = improvement."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-white/[0.08]"></div>
                <div>
                  <div className="text-sm font-semibold text-white">James R.</div>
                  <div className="text-xs text-gray-500">Options Trader, 3 years experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-24 px-10 lg:px-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 text-white">
              You're Trading Blind Without Data
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "You don't know your actual edge",
                description: "You think you're good at morning breakouts, but you've never actually measured it. Meanwhile, your real edge might be in afternoon reversals that you're ignoring."
              },
              {
                title: "Your emotions are costing you thousands",
                description: "Revenge trading after losses. Holding losers too long. Overconfident position sizing after wins. You know you do these things, but you don't know how much they're actually costing."
              },
              {
                title: "Pattern recognition takes too long",
                description: "Manually reviewing hundreds of trades to find patterns takes hours. By the time you spot something, the pattern's already changed or you've forgotten the insight."
              },
              {
                title: "Existing tools are bloated and confusing",
                description: "Other trading journals have 100 features you don't need, take 30 minutes to set up, and still don't tell you what actually matters. You want insights, not more work."
              }
            ].map((problem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.10] transition-all"
              >
                <h3 className="text-lg font-bold mb-2 text-white">
                  {problem.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xl font-semibold text-white">
              That's exactly why we built EdgeFinder AI.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-10 lg:px-20 border-y border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-3 text-white">
              From Confusion to Clarity in 3 Steps
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Your Trades',
                subtitle: 'Takes 30 seconds',
                description: 'Export your trade history from any broker as a CSV or Excel file. Drag and drop it into EdgeFinder. That\'s it. No manual entry. No complicated setup. No connecting APIs or giving us broker access.',
                detail: 'We support trades from TD Ameritrade, Interactive Brokers, Robinhood, E*TRADE, Webull, TradeStation, Alpaca, and 20+ other brokers.',
                icon: Upload
              },
              {
                step: '02',
                title: 'Our Algorithms Analyze Everything',
                subtitle: 'Takes 60 seconds',
                description: 'While you wait, 7 proprietary algorithms run in parallel: Time Pattern Algorithm, Hold Time Algorithm, Emotional Trading Detector, Streak Analysis Engine, Risk Management Scorer, Volatility Analyzer, and Edge Identifier.',
                detail: 'Then, our AI layer interprets these algorithmic results and generates plain-English insights you can act on immediately.',
                icon: Brain
              },
              {
                step: '03',
                title: 'Get Your Insights',
                subtitle: 'Instant results',
                description: 'No charts to interpret. No raw data dumps. Just clear, ranked insights: Your single biggest edge, your single biggest mistake, best/worst times to trade, emotional trading patterns, and specific actionable recommendations.',
                detail: 'Everything is presented in order of impact—what will make you the most money if you change it.',
                icon: FileText
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative p-7 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                  <div className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-widest">{item.step}</div>
                  <div className="w-11 h-11 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-purple-400 mb-3">{item.subtitle}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.detail}
                  </p>
                  {idx < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-gray-700" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-10 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-3 text-white">
              Everything You Need. Nothing You Don't.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Algorithmic Pattern Recognition',
                subtitle: 'Not just AI—actual algorithms',
                description: 'Seven proprietary algorithms analyze every dimension of your trading: timing, hold periods, position sizing, streaks, volatility, risk management, and behavioral patterns. The AI interprets them into insights you can understand.',
                icon: Brain,
                highlight: true
              },
              {
                title: 'Edge Identification',
                subtitle: 'Know exactly where your money comes from',
                description: 'See your statistically significant edges ranked by profit impact. Which time windows produce the highest win rate, which setups have the best risk-reward, which patterns are false edges.',
                icon: Target
              },
              {
                title: 'Mistake Quantification',
                subtitle: 'See what your bad habits actually cost',
                description: '"Holding losers 2x longer than winners cost you $3,400 this month." When you see the real cost, you actually change the behavior.',
                icon: Shield
              },
              {
                title: 'Emotional Trading Score',
                subtitle: 'The truth about your discipline',
                description: 'Detects revenge trading, overconfidence, loss aversion, tilt indicators, and FOMO patterns. You get a 0-10 discipline score with specific incidents flagged.',
                icon: Zap,
                highlight: true
              },
              {
                title: 'Progress Tracking',
                subtitle: 'See yourself improve over time',
                description: 'Every month, compare your new results to previous months. Win rate trending up or down? Are you fixing your biggest leaks? How much have you improved since month 1?',
                icon: TrendingUp
              },
              {
                title: 'AI Chat',
                subtitle: 'Ask questions about your data',
                description: '"Why do I lose money on Fridays?" The AI has full context of your trading history and can answer specific questions about your patterns.',
                icon: Briefcase
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
                    <h3 className="text-lg font-bold mb-1 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs font-semibold text-purple-400 mb-3">{feature.subtitle}</p>
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

      {/* Differentiation */}
      <section className="relative py-24 px-10 lg:px-20 border-y border-white/[0.03]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">
            Why EdgeFinder vs. Everything Else?
          </h2>
          
          <div className="space-y-8">
            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-xl font-bold mb-4 text-white">EdgeFinder vs. Manual Journaling</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-3">Manual Journaling:</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Takes 5-10 minutes per trade to log</li>
                    <li>• Patterns only visible if you manually review</li>
                    <li>• Emotional insights based on notes (biased)</li>
                    <li>• No statistical validation</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-400 mb-3">EdgeFinder:</p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Takes 30 seconds to upload entire month</li>
                    <li>• Algorithms automatically detect patterns</li>
                    <li>• Objective behavioral analysis</li>
                    <li>• Statistical significance on every insight</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-xl font-bold mb-4 text-white">EdgeFinder vs. Tradervue/Edgewonk</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-3">Tradervue/Edgewonk:</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• $30-80/month</li>
                    <li>• Overwhelming features and charts</li>
                    <li>• Requires 20+ minutes setup</li>
                    <li>• You interpret the data yourself</li>
                    <li>• Focus: organizing and displaying data</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-400 mb-3">EdgeFinder:</p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• $19/month</li>
                    <li>• One feature: finding what matters</li>
                    <li>• 30-second upload, zero configuration</li>
                    <li>• AI interprets and tells you what to do</li>
                    <li>• Focus: actionable intelligence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 p-6 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.15]">
            <p className="text-lg font-bold text-white">
              We're not an AI tool with trading features. We're a quantitative analysis engine with an AI interface.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              The algorithms do the heavy lifting. The AI just explains what they found in plain English.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 px-10 lg:px-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3 text-white">
              Simple, Honest Pricing
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Trial */}
            <div className="relative p-10 rounded-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">7-Day Free Trial</h3>
                <p className="text-sm text-gray-500 mb-6">Perfect for testing EdgeFinder with one month of trades</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$0</span>
                </div>
              </div>
              
              <div className="space-y-3.5 mb-9">
                {[
                  'Analyze up to 100 trades',
                  'Full access to all features',
                  'No credit card required',
                  'No automatic conversion to paid'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-3.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-bold transition-all">
                Start Free Trial →
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative">
              {/* Rainbow glow effect */}
              <div 
                className="absolute -inset-1 rounded-2xl blur-xl opacity-40"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #f97316 50%, #eab308 75%, #a855f7 100%)',
                }}
              ></div>
              
              <div className="relative p-10 rounded-xl bg-black/90 backdrop-blur-xl border border-white/[0.12]">
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
                    Most Popular
                  </span>
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-white">Pro Plan</h3>
                  <p className="text-sm text-gray-500 mb-6">Everything in the trial, plus:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">$19</span>
                    <span className="text-gray-500 font-semibold">/month</span>
                  </div>
                </div>
                
                <div className="space-y-3.5 mb-9">
                  {[
                    'Unlimited trades',
                    'Unlimited analyses',
                    'Progress tracking over time',
                    'AI chat feature',
                    'Export PDF reports',
                    'Priority support',
                    'All future features included'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-3.5 rounded-lg bg-white hover:bg-gray-100 text-black text-sm font-bold transition-all">
                  Start Free Trial →
                </button>
                
                <p className="text-center text-xs text-gray-600 mt-4">Cancel anytime. No contracts.</p>
              </div>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-16 space-y-4 max-w-[800px] mx-auto">
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h4 className="font-bold text-white mb-2">What happens after the trial?</h4>
              <p className="text-sm text-gray-500">Nothing, unless you actively subscribe. We don't auto-convert trials to paid. If you want to continue after 7 days, you click "Subscribe" and enter payment info.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h4 className="font-bold text-white mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-gray-500">Yes. Cancel instantly from your dashboard. No penalties, no retention tactics, no "are you sure?" dark patterns. One click, done.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h4 className="font-bold text-white mb-2">Do you offer refunds?</h4>
              <p className="text-sm text-gray-500">Yes. If you're unhappy in the first 30 days, email us and we'll refund you immediately, no questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-10 lg:px-20 border-t border-white/[0.03]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-5xl font-bold mb-5 text-white">
            Stop Losing to Patterns You Can't See
          </h2>
          <p className="text-lg text-gray-400 mb-9 max-w-[700px] mx-auto">
            Every trade you take without understanding your edge is a gamble. Every bad habit that costs you money is invisible until you measure it. EdgeFinder shows you what works for you.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white hover:bg-gray-100 hover:shadow-xl hover:shadow-white/10 text-black text-base font-bold transition-all">
            Start Your Free 7-Day Trial →
          </button>
          <p className="text-sm text-gray-500 mt-4">No credit card • Analyze up to 100 trades free • Takes 60 seconds to get insights</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.03] bg-black/40 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#how-it-works" className="text-gray-500 hover:text-white transition-colors text-sm">How It Works</a></li>
                <li><a href="#pricing" className="text-gray-500 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Disclaimer</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Support</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Contact Support</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Feature Requests</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Social Proof</h4>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-sm text-gray-500">4.8/5 from 500+ reviews</p>
            </div>
          </div>
          
          <div className="border-t border-white/[0.03] pt-8">
            <p className="text-xs text-gray-600 mb-4">
              EdgeFinder AI is for educational purposes only. Not financial advice. Trading involves risk of loss. Past performance does not guarantee future results. By using this tool, you acknowledge that you are solely responsible for your trading decisions.
            </p>
            <div className="text-gray-500 text-sm">© 2025 EdgeFinder AI. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}