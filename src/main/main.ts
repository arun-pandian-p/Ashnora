import { app, BrowserWindow } from 'electron';
import { createMainWindow, setupSecurityHeaders, getMainWindow } from './windows';
import { setupIpcHandlers } from './ipc';
import { setupAutoUpdater } from './updater';

// Ensure Single Instance Lock for POS Hardware and Database Safety
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    setupSecurityHeaders();
    setupIpcHandlers();
    createMainWindow();
    setupAutoUpdater();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
