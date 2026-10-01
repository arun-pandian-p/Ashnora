const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest, excludeNames = []) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (excludeNames.includes(childItemName)) return;
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        excludeNames
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const rootDir = 'C:\\Users\\Rishi\\OneDrive\\Documents\\GitHub\\Zappy';
const targetWeb = 'C:\\Projects\\Ashnora\\ashnora_web';
const targetDesktop = 'C:\\Projects\\Ashnora\\Ashnora';

fs.mkdirSync(targetWeb, { recursive: true });
fs.mkdirSync(targetDesktop, { recursive: true });

// 1. Copy Web files
const webItems = [
  'src',
  'public',
  'index.html',
  'vite.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'eslint.config.js',
  'vitest.config.ts',
  '.env.example',
  'components.json',
  'vercel.json'
];

for (const item of webItems) {
  const srcPath = path.join(rootDir, item);
  const destPath = path.join(targetWeb, item);
  if (fs.existsSync(srcPath)) {
    copyRecursiveSync(srcPath, destPath, ['node_modules', 'dist', 'dist-electron', '.git']);
  }
}

// Write Web package.json (Pure Web, NO Electron)
const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const webPkg = {
  name: "ashnora-web",
  productName: "Ashnora Web",
  version: "1.0.6",
  description: "Ashnora Restaurant OS — Web & Customer Menu",
  author: "Ashnora",
  private: true,
  type: "module",
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
    lint: "eslint .",
    test: "vitest run"
  },
  dependencies: { ...rootPkg.dependencies },
  devDependencies: {
    "@eslint/js": rootPkg.devDependencies["@eslint/js"] || "^9.32.0",
    "@types/node": rootPkg.devDependencies["@types/node"] || "^22.13.1",
    "@types/react": rootPkg.devDependencies["@types/react"] || "^18.3.18",
    "@types/react-dom": rootPkg.devDependencies["@types/react-dom"] || "^18.3.5",
    "@vitejs/plugin-react": rootPkg.devDependencies["@vitejs/plugin-react"] || "^4.3.4",
    "autoprefixer": rootPkg.devDependencies["autoprefixer"] || "^10.4.20",
    "eslint": rootPkg.devDependencies["eslint"] || "^9.32.0",
    "eslint-plugin-react-hooks": rootPkg.devDependencies["eslint-plugin-react-hooks"] || "^5.0.0",
    "eslint-plugin-react-refresh": rootPkg.devDependencies["eslint-plugin-react-refresh"] || "^0.4.19",
    "globals": rootPkg.devDependencies["globals"] || "^15.15.0",
    "postcss": rootPkg.devDependencies["postcss"] || "^8.5.2",
    "tailwindcss": rootPkg.devDependencies["tailwindcss"] || "^3.4.17",
    "typescript": rootPkg.devDependencies["typescript"] || "~5.7.2",
    "typescript-eslint": rootPkg.devDependencies["typescript-eslint"] || "^8.24.1",
    "vite": rootPkg.devDependencies["vite"] || "^5.4.14",
    "vitest": rootPkg.devDependencies["vitest"] || "^3.2.7"
  }
};
fs.writeFileSync(path.join(targetWeb, 'package.json'), JSON.stringify(webPkg, null, 2), 'utf8');

// Web .gitignore
const webGitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
out/
.next/
.output/

# Environment
.env
.env.local
.env.*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
.DS_Store
`;
fs.writeFileSync(path.join(targetWeb, '.gitignore'), webGitignore, 'utf8');

// 2. Copy Desktop files from desktop/
const desktopSrcDir = path.join(rootDir, 'desktop');
fs.readdirSync(desktopSrcDir).forEach((item) => {
  if (['node_modules', 'dist', 'dist-electron', 'release', '.git'].includes(item)) return;
  copyRecursiveSync(path.join(desktopSrcDir, item), path.join(targetDesktop, item), ['node_modules', 'dist', 'dist-electron', 'release', '.git']);
});

copyRecursiveSync(path.join(rootDir, 'scripts'), path.join(targetDesktop, 'scripts'), ['node_modules']);
fs.copyFileSync(path.join(rootDir, '.env.example'), path.join(targetDesktop, '.env.example'));

// Desktop .gitignore
const deskGitignore = `# Dependencies
node_modules/

# Build & Packaging outputs
dist/
dist-electron/
release/
out/

# Environment
.env
.env.local
.env.*.local

# Certificates (never commit private keys)
*.pfx
*.p12
*.key
*.pem

# IDE
.vscode/
.idea/
.DS_Store
`;
fs.writeFileSync(path.join(targetDesktop, '.gitignore'), deskGitignore, 'utf8');

console.log('Successfully organized separate web and desktop projects!');
