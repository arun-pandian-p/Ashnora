const fs = require('fs');

function inspect(icoPath) {
  console.log('--- Inspecting:', icoPath);
  if (!fs.existsSync(icoPath)) {
    console.log('File does not exist');
    return;
  }
  const buf = fs.readFileSync(icoPath);
  console.log('Size:', buf.length);
  const count = buf.readUInt16LE(4);
  console.log('Image count:', count);
  for (let i = 0; i < count; i++) {
    const offset = 6 + i * 16;
    const w = buf.readUInt8(offset) || 256;
    const h = buf.readUInt8(offset + 1) || 256;
    const bpp = buf.readUInt16LE(offset + 6);
    const size = buf.readUInt32LE(offset + 8);
    const imgOffset = buf.readUInt32LE(offset + 12);
    const isPng = buf.toString('hex', imgOffset, imgOffset + 8) === '89504e470d0a1a0a';
    console.log(`  #${i+1}: ${w}x${h}, bpp=${bpp}, size=${size}, isPng=${isPng}`);
  }
}

inspect('desktop/build/icons/ashnora.ico');
inspect('build/icons/ashnora.ico');
