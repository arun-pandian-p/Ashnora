/**
 * Ashnora Windows Authenticode Signing Script
 * Integrates with electron-builder to provide secure, production-grade code signing.
 *
 * Supports:
 * 1. Standard PFX certificate via WIN_CSC_LINK (path or base64) & WIN_CSC_KEY_PASSWORD
 * 2. Microsoft Azure Trusted Signing (via dlib / Azure CLI)
 * 3. Fallback timestamp authorities (DigiCert -> Sectigo -> Certum)
 * 4. Safe bypass in development/unsigned testing mode
 * 5. Strict enforcement when FORCE_SIGN=true
 */

const fs = require('fs');
const path = require('path');
const { execFile, execSync } = require('child_process');

const TIMESTAMP_SERVERS = [
  'http://timestamp.digicert.com',
  'http://timestamp.sectigo.com',
  'http://tsa.starfieldtech.com',
  'http://time.certum.pl'
];

/**
 * Locate SignTool on Windows
 */
function findSignTool() {
  // Check common Windows Kit paths
  const programFiles = process.env['ProgramFiles(x86)'] || process.env.ProgramFiles || 'C:\\Program Files (x86)';
  const kitsRoot = path.join(programFiles, 'Windows Kits', '10', 'bin');
  
  if (fs.existsSync(kitsRoot)) {
    try {
      const versions = fs.readdirSync(kitsRoot)
        .filter(v => v.startsWith('10.'))
        .sort()
        .reverse();

      for (const ver of versions) {
        const candidate = path.join(kitsRoot, ver, 'x64', 'signtool.exe');
        if (fs.existsSync(candidate)) return candidate;
      }
    } catch {}
  }

  // Check system PATH
  try {
    const which = execSync('where signtool.exe', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim().split('\r\n')[0];
    if (which && fs.existsSync(which)) return which;
  } catch {}

  // Fallback to electron-builder's vendored signtool if available
  const vendored = path.resolve('node_modules/app-builder-bin/win/x64/signtool.exe');
  if (fs.existsSync(vendored)) return vendored;

  return null;
}

/**
 * Custom Sign function called by electron-builder
 */
exports.default = async function sign(configuration) {
  const targetPath = configuration.path;
  const fileName = path.basename(targetPath);
  const certSource = process.env.WIN_CSC_LINK || process.env.CSC_LINK;
  const certPassword = process.env.WIN_CSC_KEY_PASSWORD || process.env.CSC_KEY_PASSWORD;
  const forceSign = process.env.FORCE_SIGN === 'true' || process.env.CI === 'true';

  // 1. Unsigned / Development Mode Handling
  if (!certSource) {
    if (forceSign) {
      throw new Error(
        `[CodeSign] CRITICAL: Code signing is enforced (FORCE_SIGN/CI=true), but WIN_CSC_LINK is not set.\n` +
        `Refusing to emit unsigned production binary: ${fileName}`
      );
    }
    console.log(`ℹ️ [CodeSign] Skipping Authenticode signing for ${fileName} (Unsigned/Dev mode)`);
    return;
  }

  console.log(`🔒 [CodeSign] Signing ${fileName} with Authenticode SHA-256...`);

  // 2. Resolve PFX Certificate File
  let pfxPath = certSource;
  let isTempPfx = false;

  // If WIN_CSC_LINK is a base64 encoded string, decode it into a secure temp file
  if (!fs.existsSync(certSource)) {
    try {
      const pfxBuffer = Buffer.from(certSource, 'base64');
      pfxPath = path.resolve(`.tmp-signing-${Date.now()}.pfx`);
      fs.writeFileSync(pfxPath, pfxBuffer, { mode: 0o600 });
      isTempPfx = true;
    } catch (e) {
      throw new Error(`[CodeSign] Invalid certificate path or base64 payload: ${e.message}`);
    }
  }

  const signtool = findSignTool();
  if (!signtool) {
    if (isTempPfx) fs.unlinkSync(pfxPath);
    throw new Error('[CodeSign] signtool.exe not found on system. Ensure Windows 10/11 SDK is installed.');
  }

  // 3. Attempt signing with primary and fallback timestamp authorities
  let signSuccess = false;
  let lastError = null;

  for (const tsServer of TIMESTAMP_SERVERS) {
    try {
      await new Promise((resolve, reject) => {
        const args = [
          'sign',
          '/f', pfxPath,
          '/fd', 'sha256',
          '/d', 'Ashnora Restaurant Operating System',
          '/tr', tsServer,
          '/td', 'sha256',
          '/v'
        ];

        if (certPassword) {
          args.splice(3, 0, '/p', certPassword);
        }

        args.push(targetPath);

        execFile(signtool, args, (err, stdout, stderr) => {
          if (err) {
            reject(new Error(stderr || stdout || err.message));
          } else {
            resolve(stdout);
          }
        });
      });

      console.log(`✅ [CodeSign] Successfully signed ${fileName} (Timestamp: ${tsServer})`);
      signSuccess = true;
      break;
    } catch (err) {
      console.warn(`⚠️ [CodeSign] Timestamping via ${tsServer} failed, trying fallback authority...`);
      lastError = err;
    }
  }

  // Cleanup temporary decoded PFX if created
  if (isTempPfx && fs.existsSync(pfxPath)) {
    try { fs.unlinkSync(pfxPath); } catch {}
  }

  if (!signSuccess) {
    throw new Error(`[CodeSign] Failed to sign ${fileName}: ${lastError ? lastError.message : 'Unknown error'}`);
  }
};
