import React, { useEffect, useState } from 'react';
import { Minus, Square, Copy, X, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { BRAND_LOGO } from '../assets/images';

export const DesktopTitleBar: React.FC<{ syncCount?: number }> = ({ syncCount = 0 }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [installationInfo, setInstallationInfo] = useState<{ installationId: string; machineId: string; version: string } | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsReconnecting(true);
      setTimeout(() => {
        setIsOnline(true);
        setIsReconnecting(false);
      }, 1200);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial window maximized state
    const api = (window as any).electronAPI;
    if (api) {
      api.windowIsMaximized?.().then((max: boolean) => setIsMaximized(Boolean(max)));
      const unsub = api.onMaximizeChanged?.((max: boolean) => setIsMaximized(Boolean(max)));
      
      api.getInstallationInfo?.().then((info: any) => {
        if (info) setInstallationInfo(info);
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (typeof unsub === 'function') unsub();
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    (window as any).electronAPI?.windowMinimize?.();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    (window as any).electronAPI?.windowMaximize?.();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    (window as any).electronAPI?.windowClose?.();
  };

  const handleDoubleClick = () => {
    (window as any).electronAPI?.windowMaximize?.();
  };

  const handleManualSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await (window as any).electronAPI?.db?.syncNow?.();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  return (
    <header
      onDoubleClick={handleDoubleClick}
      className="h-10 bg-[#0B1F3A] border-b border-white/10 flex items-center justify-between px-3 select-none app-region-drag z-50 text-slate-100"
    >
      {/* Brand & App Title */}
      <div className="flex items-center gap-2.5 app-region-no-drag">
        <img
          src={BRAND_LOGO}
          alt="Ashnora"
          className="w-5 h-5 object-contain drop-shadow"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-wider text-white">
            ASHNORA
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-[#F97316] border border-orange-500/30">
            DESKTOP OS
          </span>
          {installationInfo && (
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline-block">
              [{installationInfo.installationId}]
            </span>
          )}
        </div>
      </div>

      {/* Center / Status */}
      <div className="flex items-center gap-2 app-region-no-drag text-xs">
        {/* Sync Status Button */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
          title="Click to force synchronization with cloud"
        >
          <RefreshCw className={`w-3 h-3 text-[#F97316] ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="text-[11px]">{syncCount > 0 ? `${syncCount} pending sync` : 'Synced'}</span>
        </button>

        {/* Network State Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px]">
          {isReconnecting ? (
            <>
              <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
              <span className="text-amber-400 font-medium">Reconnecting...</span>
            </>
          ) : isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-rose-400" />
              <span className="text-rose-400 font-medium">Offline (Local Storage Active)</span>
            </>
          )}
        </div>
      </div>

      {/* Windows Native Control Buttons (Minimize, Maximize/Restore, Close) */}
      <div className="flex items-center app-region-no-drag -mr-3 h-full">
        <button
          onClick={handleMinimize}
          className="w-11 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Minimize"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-11 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title={isMaximized ? "Restore Down" : "Maximize"}
          aria-label={isMaximized ? "Restore Down" : "Maximize"}
        >
          {isMaximized ? (
            <Copy className="w-3 h-3 rotate-90" />
          ) : (
            <Square className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={handleClose}
          className="w-11 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#E81123] transition-colors"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

