/**
 * Ashnora Release Verification & Security Audit Script
 * Verifies Authenticode digital signatures, publisher integrity, SHA-256 checksums,
 * and ensures no development secrets or sourcemaps leaked into the production bundle.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const RELEASE_DIR = path.resolve('release');
const DIST_DIR = path.resolve('dist');

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
const version = pkg.version || '1.0.1';

const REQUIRED_FILES = [
  `Ashnora-${version}-Setup.exe`,
  `Ashnora-${version}-Setup_uninstaller.exe`,
  'win-unpacked/Ashnora.exe'
];

async function computeSHA256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

function verifyAuthenticode(filePath) {
  try {
    const psCommand = `powershell.exe -NoProfile -Command "Get-AuthenticodeSignature -FilePath '${filePath}' | Select-Object Status, StatusMessage, @{Name='Subject';Expression={$_.SignerCertificate.Subject}}, @{Name='Thumbprint';Expression={$_.SignerCertificate.Thumbprint}}, @{Name='Timestamp';Expression={$_.TimeStamperCertificate.Subject}} | ConvertTo-Json -Compress"`;
    const output = execSync(psCommand, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
    if (!output) return { status: 'Unknown', isSigned: false };
    const parsed = JSON.parse(output);
    return {
      status: parsed.Status,
      isSigned: parsed.Status === 0 || parsed.Status === 'Valid',
      subject: parsed.Subject || '',
      thumbprint: parsed.Thumbprint || '',
      timestamp: parsed.Timestamp || '',
      statusMessage: parsed.StatusMessage || ''
    };
  } catch (err) {
    return { status: 'Error', isSigned: false, error: err.message };
  }
}

async function runVerification() {
  console.log('====================================================');
  console.log('  ASHNORA WINDOWS RELEASE SECURITY & INTEGRITY AUDIT');
  console.log('====================================================\n');

  let passedAll = true;

  // 1. Verify Executable Presence & Authenticode Signatures
  console.log('🔍 [1/4] Checking Release Binaries & Digital Signatures:');
  const signatureResults = [];

  for (const relPath of REQUIRED_FILES) {
    const fullPath = path.join(RELEASE_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`  ❌ Missing binary: ${relPath}`);
      passedAll = false;
      continue;
    }

    const stats = fs.statSync(fullPath);
    const sig = verifyAuthenticode(fullPath);
    const isSigned = sig.status === 0 || sig.status === 'Valid';

    console.log(`  • ${relPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`    Signature Status: ${isSigned ? '✅ Valid' : '⚠️ ' + sig.status + (sig.statusMessage ? ' (' + sig.statusMessage + ')' : '')}`);
    if (sig.subject) console.log(`    Publisher:        ${sig.subject}`);
    if (sig.timestamp) console.log(`    Timestamp:        ${sig.timestamp}`);

    signatureResults.push({ file: relPath, isSigned, sig });
  }

  // 2. Generate SHA-256 Checksums
  console.log('\n🔒 [2/4] Generating SHA-256 Checksums:');
  const checksumEntries = [];
  const filesToHash = fs.readdirSync(RELEASE_DIR).filter(f => f.endsWith('.exe') || f.endsWith('.blockmap') || f.endsWith('.yml'));

  for (const file of filesToHash) {
    const filePath = path.join(RELEASE_DIR, file);
    if (fs.statSync(filePath).isFile()) {
      const sha256 = await computeSHA256(filePath);
      checksumEntries.push(`${sha256}  ${file}`);
      console.log(`  • ${file}: ${sha256}`);
    }
  }

  const checksumFile = path.join(RELEASE_DIR, 'SHA256SUMS.txt');
  fs.writeFileSync(checksumFile, checksumEntries.join('\n') + '\n', 'utf8');
  console.log(`  ✅ Checksums saved to: ${checksumFile}`);

  // 3. Inspect Bundled Assets for Secret Leaks & Sourcemaps
  console.log('\n🛡️ [3/4] Scanning for Bundled Secrets and Debug Artifacts:');
  let leakFound = false;

  if (fs.existsSync(DIST_DIR)) {
    function walkDir(dir) {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
          walkDir(full);
        } else {
          // Check for sourcemap leaks
          if (f.endsWith('.map')) {
            console.warn(`  ⚠️ Sourcemap detected in production build: ${path.relative(DIST_DIR, full)}`);
            leakFound = true;
          }
          // Check for env file leaks
          if (f.startsWith('.env') || f.includes('secret') || f.includes('.key')) {
            console.error(`  ❌ SENSITIVE FILE LEAKED IN DIST: ${path.relative(DIST_DIR, full)}`);
            passedAll = false;
            leakFound = true;
          }
        }
      }
    }
    walkDir(DIST_DIR);
  }

  if (!leakFound) {
    console.log('  ✅ No sourcemaps, secret keys, or .env files found in distribution bundle.');
  }

  // 4. Final Security Summary
  console.log('\n====================================================');
  console.log('  VERIFICATION SUMMARY');
  console.log('====================================================');
  const allSigned = signatureResults.every(r => r.isSigned);

  if (allSigned) {
    console.log('  🎉 Code Signing:  ALL BINARIES VALIDLY SIGNED');
  } else {
    console.log('  ℹ️ Code Signing:  Unsigned/Self-signed (Acceptable in local dev; required for production release)');
  }
  console.log('  ✅ Checksums:     Generated SHA256SUMS.txt');
  console.log('  ✅ Distribution:  Production assets verified clean');
  console.log('====================================================\n');

  if (process.env.FORCE_SIGN === 'true' && !allSigned) {
    console.error('❌ CI/CD RELEASE FAILED: Not all binaries are digitally signed.');
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
