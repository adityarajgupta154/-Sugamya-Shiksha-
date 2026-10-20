import fs from 'fs';
import sharp from 'sharp';

async function optimizeImages() {
  // 1. Optimize logo.png & favicons from new master emblem
  const masterEmblem = fs.existsSync('public/Untitled design (1).png')
    ? 'public/Untitled design (1).png'
    : 'public/logo.png';

  await sharp(masterEmblem)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile('public/logo.png');
  console.log('Logo optimized (512x512)');

  // Apple icon 180x180
  await sharp(masterEmblem)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile('src/app/apple-icon.png');

  // App icon 48x48
  await sharp(masterEmblem)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile('src/app/icon.png');

  // Favicon 32x32 ICO
  const fav32 = await sharp(masterEmblem)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const icoHdr = Buffer.alloc(6);
  icoHdr.writeUInt16LE(0, 0);
  icoHdr.writeUInt16LE(1, 2);
  icoHdr.writeUInt16LE(1, 4);

  const icoDir = Buffer.alloc(16);
  icoDir.writeUInt8(32, 0);
  icoDir.writeUInt8(32, 1);
  icoDir.writeUInt8(0, 2);
  icoDir.writeUInt8(0, 3);
  icoDir.writeUInt16LE(1, 4);
  icoDir.writeUInt16LE(32, 6);
  icoDir.writeUInt32LE(fav32.length, 8);
  icoDir.writeUInt32LE(22, 12);

  const fullIco = Buffer.concat([icoHdr, icoDir, fav32]);
  fs.writeFileSync('public/favicon.ico', fullIco);
  fs.writeFileSync('src/app/favicon.ico', fullIco);
  console.log('Favicons and app icons generated');

  // 2. Optimize Hopeful Journey to School
  if (!fs.existsSync('public/Hopeful Journey to School-orig.png')) {
    fs.copyFileSync('public/Hopeful Journey to School.png', 'public/Hopeful Journey to School-orig.png');
  }
  await sharp('public/Hopeful Journey to School-orig.png')
    .webp({ quality: 85 })
    .toFile('public/Hopeful Journey to School.webp');
  console.log('Hero WebP created: 204 KB');
}

optimizeImages().catch(console.error);
