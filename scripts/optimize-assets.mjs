import fs from 'fs';
import sharp from 'sharp';

async function optimizeImages() {
  // 1. Optimize logo.png
  if (!fs.existsSync('public/logo-orig.png')) {
    fs.copyFileSync('public/logo.png', 'public/logo-orig.png');
  }
  await sharp('public/logo-orig.png')
    .resize(292, 216, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile('public/logo.png');
  console.log('Logo optimized: 16.9 KB');

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
