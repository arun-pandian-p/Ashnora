import { contextBridge, ipcRenderer } from 'electron';
import type { Order, MenuItem, Table } from '../../../shared/types';

export interface UpdateStatusPayload {
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

export interface InstallationInfo {
  installationId: string;
  machineId: string;
  version: string;
  isPackaged: boolean;
}

export interface ElectronAPI {
  getAppInfo: () => Promise<{ name: string; version: string; platform: string; arch: string; isPackaged: boolean }>;
  getInstallationInfo: () => Promise<InstallationInfo>;
  windowMinimize: () => Promise<void>;
  windowMaximize: () => Promise<void>;
  windowIsMaximized: () => Promise<boolean>;
  windowFullscreen: () => Promise<boolean>;
  windowClose: () => Promise<void>;
  appExit: () => Promise<void>;
  onMaximizeChanged: (callback: (isMaximized: boolean) => void) => () => void;
  getStartupSettings: () => Promise<{ openAtLogin: boolean }>;
  setStartupSettings: (openAtLogin: boolean) => Promise<{ success: boolean }>;
  getMachineId: () => Promise<string>;
  listPrinters: () => Promise<any[]>;
  printReceipt: (options?: { deviceName?: string; html?: string; silent?: boolean }) => Promise<{ success: boolean; error?: string }>;
  openCashDrawer: () => Promise<{ success: boolean; message?: string }>;
  sendHeartbeat: (data: any) => Promise<{ success: boolean; timestamp: number }>;
  db: {
    getTables: () => Promise<Table[]>;
    setTables: (tables: Table[]) => Promise<{ success: boolean }>;
    updateTableStatus: (tableId: string, status: Table['status']) => Promise<boolean>;
    getMenuItems: () => Promise<MenuItem[]>;
    setMenuItems: (items: MenuItem[]) => Promise<{ success: boolean }>;
    getOrders: () => Promise<Order[]>;
    createOrder: (order: Order) => Promise<Order>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
    getSyncQueue: () => Promise<any[]>;
    syncNow: () => Promise<{ processed: number; failed: number }>;
  };
  updater: {
    checkForUpdates: () => Promise<UpdateStatusPayload>;
    downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
    installUpdate: (isSafeToRestart?: boolean) => Promise<{ success: boolean; message?: string }>;
    getStatus: () => Promise<UpdateStatusPayload>;
    onStatusChange: (callback: (status: UpdateStatusPayload) => void) => () => void;
  };
}

const electronAPI: ElectronAPI = {
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  getInstallationInfo: () => ipcRenderer.invoke('get-installation-info'),
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowIsMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  windowFullscreen: () => ipcRenderer.invoke('window-fullscreen'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  appExit: () => ipcRenderer.invoke('app-exit'),
  onMaximizeChanged: (callback) => {
    const handler = (_event: any, isMaximized: boolean) => callback(isMaximized);
    ipcRenderer.on('window:maximize-changed', handler);
    return () => {
      ipcRenderer.removeListener('window:maximize-changed', handler);
    };
  },
  getStartupSettings: () => ipcRenderer.invoke('get-startup-settings'),
  setStartupSettings: (openAtLogin) => ipcRenderer.invoke('set-startup-settings', openAtLogin),
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
  listPrinters: () => ipcRenderer.invoke('list-printers'),
  printReceipt: (options) => ipcRenderer.invoke('print-receipt', options),
  openCashDrawer: () => ipcRenderer.invoke('open-cash-drawer'),
  sendHeartbeat: (data) => ipcRenderer.invoke('send-heartbeat', data),
  db: {
    getTables: () => ipcRenderer.invoke('db-get-tables'),
    setTables: (tables) => ipcRenderer.invoke('db-set-tables', tables),
    updateTableStatus: (tableId, status) => ipcRenderer.invoke('db-update-table-status', tableId, status),
    getMenuItems: () => ipcRenderer.invoke('db-get-menu-items'),
    setMenuItems: (items) => ipcRenderer.invoke('db-set-menu-items', items),
    getOrders: () => ipcRenderer.invoke('db-get-orders'),
    createOrder: (order) => ipcRenderer.invoke('db-create-order', order),
    updateOrderStatus: (orderId, status) => ipcRenderer.invoke('db-update-order-status', orderId, status),
    getSyncQueue: () => ipcRenderer.invoke('db-get-sync-queue'),
    syncNow: () => ipcRenderer.invoke('db-sync-now'),
  },
  updater: {
    checkForUpdates: () => ipcRenderer.invoke('updater-check'),
    downloadUpdate: () => ipcRenderer.invoke('updater-download'),
    installUpdate: (isSafeToRestart = true) => ipcRenderer.invoke('updater-install', isSafeToRestart),
    getStatus: () => ipcRenderer.invoke('updater-get-status'),
    onStatusChange: (callback) => {
      const handler = (_event: any, data: UpdateStatusPayload) => callback(data);
      ipcRenderer.on('updater:status-changed', handler);
      return () => {
        ipcRenderer.removeListener('updater:status-changed', handler);
      };
    },
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
