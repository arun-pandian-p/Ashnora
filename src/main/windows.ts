import { BrowserWindow, screen, session, shell, Tray, Menu, app, nativeImage } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let appTray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development' || !process.env.ASHNORA_PACKAGED;

const ASHNORA_CSP = [
  "default-src 'self' data: blob:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://*.resend.com https://fonts.googleapis.com https://fonts.gstatic.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'"
].join('; ');

// Window State persistence helper
interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized?: boolean;
}

function getWindowStatePath(): string {
  return path.join(app.getPath('userData'), 'ashnora-window-state.json');
}

function loadSavedWindowState(): WindowState {
  try {
    const stateFile = getWindowStatePath();
    if (fs.existsSync(stateFile)) {
      const data = fs.readFileSync(stateFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[WindowState] Error reading saved state:', err);
  }
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  return {
    width: Math.min(1440, screenWidth),
    height: Math.min(900, screenHeight),
    isMaximized: false
  };
}

function saveWindowState(win: BrowserWindow): void {
  try {
    if (!win.isDestroyed()) {
      const isMaximized = win.isMaximized();
      const bounds = win.getBounds();
      const state: WindowState = {
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        isMaximized
      };
      fs.writeFileSync(getWindowStatePath(), JSON.stringify(state, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('[WindowState] Error saving state:', err);
  }
}

export function setupSecurityHeaders(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [ASHNORA_CSP],
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
      }
    });
  });

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowedPermissions = ['clipboard-read', 'clipboard-sanitized-write'];
    callback(allowedPermissions.includes(permission));
  });
}

export function createSystemTray(win: BrowserWindow): void {
  if (appTray) return;

  const iconPath = path.join(__dirname, '../build/icons/ashnora.ico');
  const trayIcon = fs.existsSync(iconPath)
    ? nativeImage.createFromPath(iconPath)
    : nativeImage.createEmpty();

  appTray = new Tray(trayIcon);
  appTray.setToolTip('Ashnora Restaurant OS — Desktop Edition');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Ashnora',
      click: () => {
        if (win.isMinimized()) win.restore();
        win.show();
        win.focus();
      }
    },
    {
      label: 'Application Status',
      click: () => {
        win.show();
        win.focus();
      }
    },
    { type: 'separator' },
    {
      label: 'Check for Updates',
      click: async () => {
        const { checkForUpdatesSafe } = await import('./updater');
        await checkForUpdatesSafe();
      }
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.quit();
      }
    }
  ]);

  appTray.setContextMenu(contextMenu);
  appTray.on('double-click', () => {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  });
}

export function createMainWindow(): BrowserWindow {
  const savedState = loadSavedWindowState();
  const iconPath = path.join(__dirname, '../build/icons/ashnora.ico');

  mainWindow = new BrowserWindow({
    width: savedState.width,
    height: savedState.height,
    x: savedState.x,
    y: savedState.y,
    minWidth: 1024,
    minHeight: 700,
    resizable: true,
    frame: false,
    icon: iconPath,
    title: 'Ashnora — Restaurant OS',
    backgroundColor: '#0B1F3A',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    autoHideMenuBar: true,
  });

  if (savedState.isMaximized) {
    mainWindow.maximize();
  }

  // Security navigation safeguards
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl);
      const isLocal = parsedUrl.protocol === 'file:' || (isDev && parsedUrl.host.startsWith('localhost'));
      if (!isLocal) {
        event.preventDefault();
        console.warn(`[Security] Blocked unauthorized navigation: ${navigationUrl}`);
      }
    } catch {
      event.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        shell.openExternal(url);
      }
    } catch {}
    return { action: 'deny' };
  });

  // Track window events for maximize state and persistence
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximize-changed', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximize-changed', false);
  });

  mainWindow.on('resize', () => {
    if (mainWindow) saveWindowState(mainWindow);
  });

  mainWindow.on('move', () => {
    if (mainWindow) saveWindowState(mainWindow);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (mainWindow) {
      createSystemTray(mainWindow);
    }
  });

  mainWindow.on('close', () => {
    if (mainWindow) saveWindowState(mainWindow);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (appTray) {
      appTray.destroy();
      appTray = null;
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (isDev && devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath);
  }

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}
