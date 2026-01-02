'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSignUp, useAuth } from '@clerk/nextjs';
import { Eye, EyeOff, CheckCircle2, ArrowRight, Zap, Shield, Target, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const passwordCriteria = {
    minLength: registerData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(registerData.password),
    hasLowercase: /[a-z]/.test(registerData.password),
    hasNumber: /[0-9]/.test(registerData.password),
  };

  const allCriteriaMet = Object.values(passwordCriteria).every(criterion => criterion);

  const passwordStrength = Math.min(
    100,
    (Object.values(passwordCriteria).filter(Boolean).length / Object.keys(passwordCriteria).length) * 100
  );

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setError('');
    setLoading(true);
    
    if (!allCriteriaMet) {
      setError('Password does not meet all criteria');
      setLoading(false);
      return;
    }

    if (!registerData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }
    
    try {
      await signUp.create({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        emailAddress: registerData.email,
        password: registerData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerificationStep(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setError('');
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google sign up failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#080808] text-gray-100 overflow-hidden relative flex items-center justify-center">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
          * {
            font-family: 'Space Grotesk', -apple-system, sans-serif;
          }
        `}</style>

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

        <div className="relative z-10 text-center max-w-[500px] mx-auto px-10">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white">Welcome to EdgeFinder!</h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Your account has been successfully created. Check your email to verify your account and start discovering your trading edge in 60 seconds.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white hover:bg-gray-100 text-black text-base font-bold transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 overflow-hidden relative flex flex-col">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        * {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
      `}</style>

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
          </div>
        </div>
      </header>

      <div className="relative flex-1 pt-28 pb-0 px-10 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-180px)]">
            
            <div className="relative order-2 lg:order-1 flex flex-col justify-start">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5 rounded-2xl blur-3xl pointer-events-none"></div>
              
              <div className="relative">
                <div className="mb-8">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-2.5 leading-[1.2] tracking-tight text-white">
                    Start Finding Your Edge
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Join 2,000+ traders who are already improving their performance
                  </p>
                </div>

                <div className="space-y-3.5 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-0.5">Discover Your Edge</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        7 proprietary algorithms analyze your trading
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-0.5">Quantify Your Mistakes</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        See what your bad habits cost you
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-0.5">60 Second Analysis</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Upload and get instant insights
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hidden lg:block">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-3">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-9 h-9 rounded-full border-2 border-[#080808]"
                          style={{
                            background: `linear-gradient(135deg, ${
                              i === 0 ? 'rgba(168,85,247,0.3)' :
                              i === 1 ? 'rgba(236,72,153,0.3)' :
                              i === 2 ? 'rgba(249,115,22,0.3)' :
                              'rgba(234,179,8,0.3)'
                            }, transparent)`
                          }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">2,000+ Active Traders</div>
                      <div className="text-xs text-gray-500">Trusted worldwide</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-white">4.8/5</span>
                    <span className="text-xs text-gray-500">500+ reviews</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm max-h-[calc(100vh-180px)] overflow-y-auto">
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Sign up</h3>
                  <p className="text-xs text-gray-500">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                      Log in
                    </Link>
                  </p>
                </div>

                <form onSubmit={verificationStep ? handleVerificationSubmit : handleRegisterSubmit} className={verificationStep ? "space-y-4" : "space-y-3"}>
                  {verificationStep ? (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-white mb-1.5">Verification Code</label>
                        <p className="text-xs text-gray-500 mb-2">Enter the code sent to {registerData.email}</p>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="000000"
                          required
                          className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-center tracking-widest"
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-xs text-red-400 font-semibold">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Verify Email'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-white mb-1.5">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={registerData.firstName}
                            onChange={handleRegisterChange}
                            placeholder="John"
                            required
                            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white mb-1.5">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={registerData.lastName}
                            onChange={handleRegisterChange}
                            placeholder="Doe"
                            required
                            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white mb-1.5">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          placeholder="you@example.com"
                          required
                          className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white mb-1.5">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-gray-400">Password Strength</label>
                            <span className={`text-xs font-semibold ${
                              passwordStrength === 0 ? 'text-gray-500' :
                              passwordStrength < 25 ? 'text-red-400' :
                              passwordStrength < 50 ? 'text-orange-400' :
                              passwordStrength < 75 ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {passwordStrength === 0 ? 'No password' :
                               passwordStrength < 25 ? 'Weak' :
                               passwordStrength < 50 ? 'Fair' :
                               passwordStrength < 75 ? 'Good' :
                               'Strong'}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/[0.05] border border-white/[0.08] overflow-hidden">
                            <div 
                              className="h-full transition-all duration-300 ease-out rounded-full"
                              style={{
                                width: `${passwordStrength}%`,
                                background: passwordStrength === 0 ? 'transparent' :
                                            passwordStrength < 25 ? 'linear-gradient(90deg, #ef4444, #f87171)' :
                                            passwordStrength < 50 ? 'linear-gradient(90deg, #f97316, #fb923c)' :
                                            passwordStrength < 75 ? 'linear-gradient(90deg, #eab308, #facc15)' :
                                            'linear-gradient(90deg, #22c55e, #4ade80)'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 pt-2">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={registerData.agreeToTerms}
                          onChange={handleRegisterChange}
                          className="mt-0.5 w-4 h-4 rounded border border-white/[0.08] bg-white/[0.05] accent-purple-600 cursor-pointer flex-shrink-0"
                        />
                        <label className="text-xs text-gray-400 leading-relaxed flex-1">
                          I agree to EdgeFinder's{' '}
                          <a href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">Terms</a>
                          {' '}and{' '}
                          <a href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">Privacy Policy</a>
                        </label>
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-xs text-red-400 font-semibold">{error}</p>
                        </div>
                      )}

                      <div className="flex justify-center py-2">
                        <div id="clerk-captcha" />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </button>

                      <div className="relative flex items-center justify-center my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/[0.08]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-[#080808] text-gray-500 font-semibold">OR</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={handleGoogleSignUp}
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <Chrome className="w-4 h-4" />
                          Sign up with Google
                        </button>
                      </div>

                      <p className="text-center text-xs text-gray-500 pt-2">
                        No credit card • 7-day trial • Cancel anytime
                      </p>
                    </>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer className="relative border-t border-white/[0.03] bg-black/40 backdrop-blur-xl mt-auto">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © 2025 EdgeFinder AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
