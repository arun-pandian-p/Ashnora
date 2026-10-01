import React, { useEffect, useState } from 'react';
import { ArrowDownCircle, RefreshCw, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UpdateStatusPayload } from '../../preload/preload';

export const UpdateNotificationBanner: React.FC<{ isPosBusy?: boolean }> = ({ isPosBusy = false }) => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatusPayload | null>(null);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);

  useEffect(() => {
    const api = (window as any).electronAPI?.updater;
    if (!api) return;

    api.getStatus().then((status: UpdateStatusPayload) => {
      setUpdateStatus(status);
    }).catch(console.error);

    const unsubscribe = api.onStatusChange((status: UpdateStatusPayload) => {
      setUpdateStatus(status);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!updateStatus) return null;

  // If user dismissed this version update prompt for now
  if (dismissedVersion && dismissedVersion === updateStatus.availableVersion && updateStatus.state === 'available') {
    return null;
  }

  const handleDownload = async () => {
    try {
      await (window as any).electronAPI?.updater?.downloadUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestart = async () => {
    if (isPosBusy) {
      alert('Cannot restart while an order or billing transaction is active. Please complete or save current ticket first.');
      return;
    }
    try {
      await (window as any).electronAPI?.updater?.installUpdate(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = () => {
    if (updateStatus.availableVersion) {
      setDismissedVersion(updateStatus.availableVersion);
    }
  };

  if (updateStatus.state === 'available') {
    return (
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-orange-500/30 px-4 py-2 flex items-center justify-between text-xs text-orange-200 z-50 animate-in fade-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            <strong className="text-white">Ashnora v{updateStatus.availableVersion}</strong> is available.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            Download Update
          </button>
          <button
            onClick={handleDismiss}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-slate-300 rounded-lg transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    );
  }

  if (updateStatus.state === 'downloading') {
    const percent = updateStatus.progress?.percent || 0;
    return (
      <div className="bg-[#0B1F3A] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-slate-300 z-50">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <RefreshCw className="w-3.5 h-3.5 text-orange-400 animate-spin shrink-0" />
          <span className="text-slate-200 font-medium">Downloading Ashnora v{updateStatus.availableVersion}...</span>
          <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-orange-400">{percent}%</span>
        </div>
        <span className="text-[11px] text-slate-400">Background download active</span>
      </div>
    );
  }

  if (updateStatus.state === 'downloaded') {
    return (
      <div className="bg-gradient-to-r from-emerald-950/40 via-emerald-900/40 to-emerald-950/40 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 z-50 animate-in fade-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">Update ready.</strong> Restart Ashnora to complete the update to v{updateStatus.availableVersion}.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            Restart & Update
          </button>
          <button
            onClick={() => setDismissedVersion('ready')}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-slate-300 rounded-lg transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    );
  }

  return null;
};
