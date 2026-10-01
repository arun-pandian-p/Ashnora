const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createPngIco(pngBuffers) {
  // 6 bytes header + 16 bytes per entry
  const headerSize = 6 + pngBuffers.length * 16;
  let currentOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // Count

  const entries = [];
  const imageBuffers = [];

  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette count
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel (32-bit RGBA)
    entry.writeUInt32LE(buffer.length, 8); // Size of image data
    entry.writeUInt32LE(currentOffset, 12); // Offset of image data

    entries.push(entry);
    imageBuffers.push(buffer);
    currentOffset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBuffers]);
}

async function generate() {
  const sourcePath = path.resolve('public/brand/ashnora-glossy-icon.png');
  console.log('Source image:', sourcePath);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source image not found: ${sourcePath}`);
  }

  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngFrames = [];

  for (const size of sizes) {
    const buffer = await sharp(sourcePath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: sharp.kernel.lanczos3
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    pngFrames.push({ width: size, height: size, buffer });
    console.log(`✓ Prepared ${size}x${size} RGBA PNG frame (${buffer.length} bytes)`);
  }

  const icoBuffer = createPngIco(pngFrames);
  console.log(`Generated standard Windows PNG-in-ICO (${icoBuffer.length} bytes)`);

  const targetLocations = [
    path.resolve('desktop/build/icons/ashnora.ico'),
    path.resolve('desktop/build/icons/installer.ico'),
    path.resolve('desktop/build/icons/uninstaller.ico'),
    path.resolve('desktop/build/icon.ico'),
    path.resolve('desktop/build/installerIcon.ico'),
    path.resolve('desktop/build/uninstallerIcon.ico'),
    path.resolve('desktop/public/icon.ico'),
    path.resolve('desktop/public/brand/ashnora-icon.ico'),
    path.resolve('build/icons/ashnora.ico'),
    path.resolve('build/icons/installer.ico'),
    path.resolve('build/icons/uninstaller.ico'),
    path.resolve('build/icon.ico'),
    path.resolve('build/installerIcon.ico'),
    path.resolve('build/uninstallerIcon.ico'),
    path.resolve('public/brand/ashnora-icon.ico'),
    path.resolve('public/icon.ico'),
    path.resolve('vercel/public/icon.ico'),
    path.resolve('vercel/public/favicon.ico')
  ];

  for (const loc of targetLocations) {
    const parentDir = path.dirname(loc);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(loc, icoBuffer);
    console.log(`Saved clean 32-bit ICO to ${loc}`);
  }

  // 512x512 high-res clean PNG
  const highRes512 = await sharp(sourcePath)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3
    })
    .png()
    .toBuffer();

  const pngLocations = [
    path.resolve('desktop/build/icon.png'),
    path.resolve('desktop/public/brand/ashnora-icon-512.png'),
    path.resolve('desktop/public/brand/ashnora-glossy-icon.png'),
    path.resolve('build/icon.png'),
    path.resolve('public/brand/ashnora-icon-512.png')
  ];

  for (const loc of pngLocations) {
    const parentDir = path.dirname(loc);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(loc, highRes512);
    console.log(`Saved clean 512 PNG to ${loc}`);
  }

  console.log('🎉 Generated pristine 32-bit PNG-encoded Windows ICO!');
}

generate().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
