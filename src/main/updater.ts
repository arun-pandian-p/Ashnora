import { app, BrowserWindow, ipcMain } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import { getMainWindow } from './windows';

// Update State tracker
export interface UpdateStatus {
  state: 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error';
  currentVersion: string;
  availableVersion?: string;
  releaseNotes?: string;
  progress?: {
    percent: number;
    bytesPerSecond: number;
    transferred: number;
    total: number;
  };
  error?: string;
}

let updateStatus: UpdateStatus = {
  state: 'idle',
  currentVersion: app.getVersion() || '1.0.1',
};

let checkIntervalTimer: NodeJS.Timeout | null = null;

function sendToWindow(channel: string, payload: any) {
  const win = getMainWindow();
  if (win && !win.isDestroyed()) {
    win.webContents.send(channel, payload);
  }
}

export function setupAutoUpdater(): void {
  // Configure electron-updater
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;
  autoUpdater.allowDowngrade = false;

  // Logging configuration
  autoUpdater.logger = {
    info: (msg: any) => console.log('[AutoUpdater]', msg),
    warn: (msg: any) => console.warn('[AutoUpdater]', msg),
    error: (msg: any) => console.error('[AutoUpdater]', msg),
    debug: (msg: any) => console.debug('[AutoUpdater]', msg),
  };

  // Event Handlers
  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates on GitHub Releases...');
    updateStatus = {
      ...updateStatus,
      state: 'checking',
      error: undefined,
    };
    sendToWindow('updater:status-changed', updateStatus);
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version);
    updateStatus = {
      ...updateStatus,
      state: 'available',
      availableVersion: info.version,
      releaseNotes: typeof info.releaseNotes === 'string' ? info.releaseNotes : undefined,
      error: undefined,
    };
    sendToWindow('updater:status-changed', updateStatus);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('[AutoUpdater] Up to date (latest:', info.version, ')');
    updateStatus = {
      ...updateStatus,
      state: 'not-available',
      availableVersion: info.version,
      error: undefined,
    };
    sendToWindow('updater:status-changed', updateStatus);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    updateStatus = {
      ...updateStatus,
      state: 'downloading',
      progress: {
        percent: Math.round(progressObj.percent || 0),
        bytesPerSecond: progressObj.bytesPerSecond || 0,
        transferred: progressObj.transferred || 0,
        total: progressObj.total || 0,
      },
    };
    sendToWindow('updater:status-changed', updateStatus);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update downloaded and verified:', info.version);
    updateStatus = {
      ...updateStatus,
      state: 'downloaded',
      availableVersion: info.version,
      error: undefined,
    };
    sendToWindow('updater:status-changed', updateStatus);
  });

  autoUpdater.on('error', (err) => {
    // Graceful offline handling: do not log scary red errors when user is simply offline
    const isOffline = !navigator?.onLine || err.message?.includes('net::ERR') || err.message?.includes('ENOTFOUND');
    console.warn('[AutoUpdater] Check notice:', isOffline ? 'Network unreachable (offline mode)' : err.message);

    updateStatus = {
      ...updateStatus,
      state: isOffline ? 'idle' : 'error',
      error: isOffline ? 'Offline mode active. Check skipped.' : err.message,
    };
    sendToWindow('updater:status-changed', updateStatus);
  });

  // Setup periodic checking every 6 hours (6 * 60 * 60 * 1000 ms)
  if (checkIntervalTimer) clearInterval(checkIntervalTimer);
  checkIntervalTimer = setInterval(() => {
    checkForUpdatesSafe();
  }, 6 * 60 * 60 * 1000);

  // Initial check 5 seconds after startup if packaged
  setTimeout(() => {
    if (app.isPackaged) {
      checkForUpdatesSafe();
    }
  }, 5000);
}

export async function checkForUpdatesSafe(): Promise<UpdateStatus> {
  updateStatus.currentVersion = app.getVersion();
  if (!app.isPackaged) {
    console.log('[AutoUpdater] Development environment detected; returning current mock state');
    updateStatus = {
      state: 'not-available',
      currentVersion: app.getVersion(),
    };
    sendToWindow('updater:status-changed', updateStatus);
    return updateStatus;
  }

  try {
    await autoUpdater.checkForUpdates();
  } catch (err: any) {
    console.warn('[AutoUpdater] Safe check caught error:', err.message);
  }
  return updateStatus;
}

export async function startDownloadUpdate(): Promise<{ success: boolean; error?: string }> {
  try {
    updateStatus = { ...updateStatus, state: 'downloading' };
    sendToWindow('updater:status-changed', updateStatus);
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (err: any) {
    updateStatus = { ...updateStatus, state: 'error', error: err.message };
    sendToWindow('updater:status-changed', updateStatus);
    return { success: false, error: err.message };
  }
}

export function quitAndInstallUpdate(isSafeToRestart: boolean = true): { success: boolean; message?: string } {
  if (!isSafeToRestart) {
    return { success: false, message: 'Restart blocked: active operations in progress.' };
  }

  if (updateStatus.state !== 'downloaded') {
    return { success: false, message: 'Update has not been downloaded yet.' };
  }

  console.log('[AutoUpdater] Restarting application to apply update...');
  // isSilent: false, isForceRunAfter: true (ensures clean restart after NSIS executes)
  autoUpdater.quitAndInstall(false, true);
  return { success: true };
}

export function getUpdateStatus(): UpdateStatus {
  updateStatus.currentVersion = app.getVersion();
  return updateStatus;
}
