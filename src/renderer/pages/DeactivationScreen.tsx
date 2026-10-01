import React, { useState } from 'react';
import { ShieldAlert, KeyRound, RefreshCw, Lock, AlertTriangle, Building2, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DeactivationScreen: React.FC = () => {
  const { restaurantProfile } = useApp();
  const [reactivationKey, setReactivationKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleReactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reactivationKey.trim()) {
      setErrorMsg('Please enter a valid recovery or reactivation key.');
      return;
    }
    setIsVerifying(true);
    setErrorMsg('');

    // Simulate verification or recovery
    setTimeout(() => {
      if (reactivationKey.trim() === 'ASHNORA-ACTIVE-2026' || reactivationKey.trim() === 'RESTORE-PASS-99') {
        window.location.reload();
      } else {
        setErrorMsg('Invalid authorization key. Contact your Super Admin or Restaurant Owner.');
        setIsVerifying(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-40px)] bg-[#0B1F3A] flex items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/90 border border-rose-500/30 rounded-2xl shadow-2xl p-8 backdrop-blur-xl relative z-10 text-center">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-5 text-rose-400 shadow-inner">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-[11px] font-bold tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full uppercase">
          Terminal Deactivated
        </span>

        <h1 className="text-2xl font-black text-white mt-3 mb-2">
          Installation Access Suspended
        </h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          This Ashnora terminal for <span className="text-white font-semibold">{restaurantProfile.name}</span> has been remotely deactivated by Super Admin control or security policy.
        </p>

        {/* Security / Isolation Notice */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 text-left mb-6 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Local Restaurant Data Preserved</span>
          </div>
          <p className="text-slate-400 leading-normal pl-6">
            All offline orders, table status, and inventory transactions remain safely encrypted on this machine and have not been wiped.
          </p>
        </div>

        {/* Reactivation Key Form */}
        <form onSubmit={handleReactivate} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Super Admin Recovery / Activation Key</span>
            </label>
            <input
              type="password"
              value={reactivationKey}
              onChange={(e) => setReactivationKey(e.target.value)}
              placeholder="Enter authorization key..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#F97316] font-mono transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check Status</span>
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Reactivate</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-500 mt-6">
          Machine ID: <span className="font-mono text-slate-400">WIN-ASHNORA-POS-01</span> • Support: <span className="text-[#F97316]">support@ashnora.com</span>
        </p>
      </div>
    </div>
  );
};
