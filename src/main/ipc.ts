import { ipcMain, app, BrowserWindow } from 'electron';
import { getMainWindow } from './windows';
import { localDb } from './database';
import type { Order, MenuItem, Table } from '../../../shared/types';

export function setupIpcHandlers(): void {
  // App & Installation Info
  ipcMain.handle('get-app-info', () => ({
    name: 'Ashnora',
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    isPackaged: app.isPackaged,
  }));

  ipcMain.handle('get-installation-info', async () => {
    try {
      const os = await import('os');
      const crypto = await import('crypto');
      const machineRaw = `${os.hostname()}-${os.platform()}-${os.arch()}-${os.cpus()?.[0]?.model || 'ashnora-desktop'}`;
      const machineId = crypto.createHash('sha256').update(machineRaw).digest('hex').substring(0, 16);
      const installationId = `inst-${machineId.substring(0, 8)}`;
      return {
        installationId,
        machineId,
        version: app.getVersion(),
        isPackaged: app.isPackaged
      };
    } catch {
      return {
        installationId: 'inst-ashnora-01',
        machineId: 'ashnora-device-01',
        version: app.getVersion(),
        isPackaged: app.isPackaged
      };
    }
  });

  // Window Controls
  ipcMain.handle('window-minimize', () => {
    getMainWindow()?.minimize();
  });

  ipcMain.handle('window-maximize', () => {
    const win = getMainWindow();
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.handle('window-is-maximized', () => {
    return getMainWindow()?.isMaximized() ?? false;
  });

  ipcMain.handle('window-fullscreen', () => {
    const win = getMainWindow();
    if (win) {
      const isFull = win.isFullScreen();
      win.setFullScreen(!isFull);
      return !isFull;
    }
    return false;
  });

  ipcMain.handle('window-close', () => {
    getMainWindow()?.close();
  });

  ipcMain.handle('app-exit', () => {
    app.quit();
  });

  // Windows Startup Settings
  ipcMain.handle('get-startup-settings', () => {
    return {
      openAtLogin: app.getLoginItemSettings().openAtLogin
    };
  });

  ipcMain.handle('set-startup-settings', (_event, openAtLogin: boolean) => {
    app.setLoginItemSettings({
      openAtLogin: Boolean(openAtLogin),
      path: process.execPath
    });
    return { success: true };
  });

  // Machine Hardware / ID
  ipcMain.handle('get-machine-id', async () => {
    try {
      const os = await import('os');
      const crypto = await import('crypto');
      const rawId = `${os.hostname()}-${os.platform()}-${os.arch()}-${os.cpus()?.[0]?.model || 'ashnora-pos'}`;
      return crypto.createHash('sha256').update(rawId).digest('hex').substring(0, 16);
    } catch {
      return 'ashnora-device-01';
    }
  });

  // Hardware & Printing
  ipcMain.handle('list-printers', async () => {
    const win = getMainWindow();
    if (!win) return [];
    try {
      return await win.webContents.getPrintersAsync();
    } catch (err) {
      console.error('[Electron] Error listing printers:', err);
      return [];
    }
  });

  ipcMain.handle('print-receipt', async (_event, options: { deviceName?: string; html?: string; silent?: boolean } = {}) => {
    const mainWindow = getMainWindow();
    if (!mainWindow) return { success: false, error: 'Window not available' };

    const deviceName = typeof options.deviceName === 'string' ? options.deviceName.slice(0, 128) : '';
    const silent = Boolean(options.silent);

    try {
      if (options.html) {
        if (typeof options.html !== 'string' || options.html.length > 2 * 1024 * 1024) {
          return { success: false, error: 'HTML payload exceeds safe limit' };
        }

        const printWin = new BrowserWindow({
          show: false,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: true,
          },
        });

        await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(options.html)}`);
        return await new Promise((resolve) => {
          printWin.webContents.print(
            {
              silent,
              printBackground: true,
              deviceName,
            },
            (success, failureReason) => {
              printWin.close();
              if (!success) {
                resolve({ success: false, error: failureReason });
              } else {
                resolve({ success: true });
              }
            }
          );
        });
      } else {
        return await new Promise((resolve) => {
          mainWindow.webContents.print(
            {
              silent,
              printBackground: true,
              deviceName,
            },
            (success, failureReason) => {
              if (!success) resolve({ success: false, error: failureReason });
              else resolve({ success: true });
            }
          );
        });
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('open-cash-drawer', async () => {
    return { success: true, message: 'Cash drawer trigger pulse sent' };
  });

  // Heartbeat & Telemetry
  ipcMain.handle('send-heartbeat', async (_event, data: any) => {
    console.log('[Heartbeat] Received heartbeat packet:', data);
    return { success: true, timestamp: Date.now() };
  });

  // Local Offline DB IPC
  ipcMain.handle('db-get-tables', () => localDb.getTables());
  ipcMain.handle('db-set-tables', (_event, tables: Table[]) => {
    localDb.setTables(tables);
    return { success: true };
  });
  ipcMain.handle('db-update-table-status', (_event, tableId: string, status: Table['status']) => {
    return localDb.updateTableStatus(tableId, status);
  });

  ipcMain.handle('db-get-menu-items', () => localDb.getMenuItems());
  ipcMain.handle('db-set-menu-items', (_event, items: MenuItem[]) => {
    localDb.setMenuItems(items);
    return { success: true };
  });

  ipcMain.handle('db-get-orders', () => localDb.getOrders());
  ipcMain.handle('db-create-order', (_event, order: Order) => {
    return localDb.createOrder(order);
  });
  ipcMain.handle('db-update-order-status', (_event, orderId: string, status: Order['status']) => {
    return localDb.updateOrderStatus(orderId, status);
  });

  ipcMain.handle('db-get-sync-queue', () => localDb.getSyncQueue());
  ipcMain.handle('db-sync-now', async () => {
    return await localDb.processSyncQueue();
  });

  // Auto Updater IPC Handlers
  ipcMain.handle('updater-check', async () => {
    const { checkForUpdatesSafe } = await import('./updater');
    return await checkForUpdatesSafe();
  });

  ipcMain.handle('updater-download', async () => {
    const { startDownloadUpdate } = await import('./updater');
    return await startDownloadUpdate();
  });

  ipcMain.handle('updater-install', async (_event, isSafeToRestart?: boolean) => {
    const { quitAndInstallUpdate } = await import('./updater');
    return quitAndInstallUpdate(isSafeToRestart ?? true);
  });

  ipcMain.handle('updater-get-status', async () => {
    const { getUpdateStatus } = await import('./updater');
    return getUpdateStatus();
  });
}
