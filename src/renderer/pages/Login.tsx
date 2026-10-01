import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowLeft, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { BRAND_LOGO, LOGIN_TEAM_IMAGE } from '../assets/images';

export const LoginScreen: React.FC = () => {
  const { setCurrentScreen, login } = useApp();
  const [emailOrUsername, setEmailOrUsername] = useState('admin@prepville.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      setError('Please enter your authorized username or email');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login('ASH-BLR-01', emailOrUsername.trim(), password);
      if (!res.success) {
        setError(res.message || 'Authentication failed. Please check your credentials.');
      }
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-full w-full bg-[#FDFBF7] flex flex-col justify-between select-none relative overflow-x-hidden overflow-y-auto">
      {/* Top Right Orange Gradient Wave Accent */}
      <div className="absolute top-0 right-0 w-[45vw] max-w-[550px] h-[240px] pointer-events-none z-0">
        <svg viewBox="0 0 500 250" preserveAspectRatio="none" className="w-full h-full">
          <path d="M120,0 C220,130 360,180 500,70 L500,0 Z" fill="#F97316" />
          <path d="M260,0 C340,90 420,120 500,40 L500,0 Z" fill="#FB923C" opacity="0.8" />
        </svg>
      </div>

      {/* Bottom Left Deep Navy & Orange Wave Accent */}
      <div className="absolute -bottom-10 -left-10 w-[40vw] max-w-[500px] h-[200px] pointer-events-none z-0">
        <svg viewBox="0 0 500 250" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,130 C160,70 300,180 440,250 L0,250 Z" fill="#F97316" />
          <path d="M0,170 C140,110 260,200 380,250 L0,250 Z" fill="#0B1F3A" />
        </svg>
      </div>

      {/* Top Header Navigation */}
      <div className="p-6 md:p-8 relative z-20 flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="px-4 py-2 rounded-full bg-white/95 hover:bg-white border border-slate-200/80 text-[#0F172A] hover:text-[#F97316] text-xs font-bold flex items-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/70 shadow-xs text-xs font-bold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Automated Role Authentication</span>
        </div>
      </div>

      {/* Main Container with 2-Column Split */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-4 flex items-center justify-center relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Hero Visual */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-[32px] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100/50 border border-orange-200/60 shadow-xl flex items-center justify-center p-3 group">
              <img
                src={LOGIN_TEAM_IMAGE}
                alt="Ashnora Restaurant Team"
                className="w-full h-full object-cover rounded-[24px] shadow-sm transform group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-5 left-5 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-orange-200 text-xs font-black text-[#0B1F3A] flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Ashnora Restaurant OS</span>
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-black text-[#0B1F3A] tracking-tight">
                Unified Hospitality & Terminal OS
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Sign in with your restaurant account. Your designated role (Admin, Cashier, Kitchen, Waiter, or Inventory) will be authenticated automatically.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>POS & Thermal Print</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Live Kitchen Display</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Tables & QR Orders</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cloud & Local Sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px]">
              <div className="bg-white rounded-[28px] border border-slate-100 shadow-[0_20px_50px_rgba(11,31,58,0.1)] p-8 md:p-10 backdrop-blur-xl relative">
                {/* Ashnora Brand Logo Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center gap-2.5 mb-2">
                    <img
                      src={BRAND_LOGO}
                      alt="Ashnora"
                      className="w-9 h-9 object-contain drop-shadow"
                    />
                    <div className="text-left">
                      <span className="text-xl font-black text-[#0B1F3A] tracking-tight block leading-none">
                        Ashnora
                      </span>
                      <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest block mt-0.5">
                        Restaurant OS
                      </span>
                    </div>
                  </div>

                  <h1 className="text-2xl font-black text-[#0B1F3A] tracking-tight mt-3">
                    Sign In to Terminal
                  </h1>
                  <p className="text-xs text-[#64748B] font-medium mt-1">
                    Enter your authorized credentials to access your terminal
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email or Username */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      USERNAME OR EMAIL
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="admin@prepville.com or staff ID"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFC] text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-[#F8FAFC] text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => alert('Please contact your restaurant administrator or owner to reset your credentials.')}
                      className="text-xs font-bold text-[#F97316] hover:text-orange-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In Primary Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#F97316] hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-extrabold shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-75"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  </button>
                </form>

                {/* Footer Direct Access Note */}
                <p className="text-[11px] text-slate-400 font-medium text-center mt-6 leading-relaxed">
                  Role and permissions are automatically authenticated from your restaurant database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="py-3 text-center text-[10px] text-slate-400 relative z-10">
        Ashnora Restaurant OS • Version 1.0.6 • Protected Desktop Installation
      </div>
    </div>
  );
};
