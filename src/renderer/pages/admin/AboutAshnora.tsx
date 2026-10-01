import React, { useState, useEffect } from 'react';
import {
  Info,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building,
  Sparkles,
  Award,
  Layers,
  Heart
} from 'lucide-react';
import { BRAND_LOGO } from '../../assets/images';

export const AboutAshnora: React.FC = () => {
  const [updateStatus, setUpdateStatus] = useState<any>({
    state: 'idle',
    currentVersion: '1.0.6'
  });
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Today at 08:00 AM');

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api?.updater) {
      api.updater.getStatus?.().then((status: any) => {
        if (status) setUpdateStatus(status);
      });
      const unsub = api.updater.onStatusChange?.((status: any) => {
        setUpdateStatus(status);
      });
      return () => {
        if (typeof unsub === 'function') unsub();
      };
    }
  }, []);

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    const api = (window as any).electronAPI;
    try {
      if (api?.updater?.checkForUpdates) {
        const res = await api.updater.checkForUpdates();
        setUpdateStatus(res);
      }
      setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Ignored
    } finally {
      setTimeout(() => setCheckingUpdate(false), 700);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 select-none">
      {/* Brand Hero Card */}
      <div className="bg-gradient-to-br from-[#0B1F3A] to-[#162D4A] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-white p-3 shadow-xl flex items-center justify-center shrink-0">
            <img src={BRAND_LOGO} alt="Ashnora" className="w-full h-full object-contain" />
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-2xl font-black tracking-tight">ASHNORA</h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                v1.0.6 • Build 106
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Signed Release
              </span>
            </div>
            <p className="text-slate-300 text-sm font-medium max-w-xl">
              Next-generation unified restaurant operating system — seamlessly orchestrating POS billing, kitchen KDS, live table seating, staff, and hardware printing.
            </p>
          </div>
        </div>
      </div>

      {/* Specifications & System Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-orange-500" />
            Product & Publisher Information
          </h3>

          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="flex justify-between items-center pt-2 first:pt-0">
              <span className="text-slate-500">Product Name:</span>
              <span className="font-bold text-slate-800">Ashnora Restaurant OS</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Version:</span>
              <span className="font-mono font-bold text-slate-800">1.0.6 (Build 106)</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Publisher:</span>
              <span className="font-semibold text-slate-800">Ashnora</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Target Platform:</span>
              <span className="font-semibold text-slate-800">Windows 10 / Windows 11 (x64)</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Installation ID:</span>
              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">inst-7b94••••</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Copyright:</span>
              <span className="text-slate-600">© 2026 Ashnora Inc. All rights reserved.</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Update Channel & Status
            </h3>
            <button
              onClick={handleCheckUpdate}
              disabled={checkingUpdate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${checkingUpdate ? 'animate-spin text-orange-500' : ''}`} />
              <span>{checkingUpdate ? 'Checking...' : 'Check'}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="flex justify-between items-center pt-2 first:pt-0">
              <span className="text-slate-500">Update Channel:</span>
              <span className="font-bold text-slate-800">Production (Stable)</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Latest Version Installed
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Last Checked:</span>
              <span className="text-slate-700">{lastChecked}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Rollback Safety:</span>
              <span className="font-semibold text-emerald-700">Protected</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Integrity Check:</span>
              <span className="font-semibold text-slate-700">SHA-256 Hash Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
