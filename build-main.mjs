import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.argv.includes('--dev');

async function bundle() {
  const commonConfig = {
    bundle: true,
    platform: 'node',
    target: 'node20',
    sourcemap: isDev,
    minify: !isDev,
    format: 'esm',
    external: [
      'electron',
      'electron-updater',
      'better-sqlite3',
      'sql.js',
      'fs',
      'path',
      'crypto',
      'os',
      'url'
    ],
  };

  try {
    // Build Main process
    await build({
      ...commonConfig,
      entryPoints: [path.join(__dirname, 'src/main/main.ts')],
      outfile: path.join(__dirname, 'dist-electron/main.js'),
    });

    // Build Preload script (CommonJS for Electron preload compatibility)
    await build({
      ...commonConfig,
      format: 'cjs',
      entryPoints: [path.join(__dirname, 'src/preload/preload.ts')],
      outfile: path.join(__dirname, 'dist-electron/preload.js'),
    });

    console.log('✓ Desktop Electron main and preload built successfully.');
  } catch (err) {
    console.error('Failed to build Electron:', err);
    process.exit(1);
  }
}

bundle();
