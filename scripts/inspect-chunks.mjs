import fs from 'fs';
import path from 'path';

const chunkDir = '.next/static/chunks';
const files = fs.readdirSync(chunkDir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const content = fs.readFileSync(path.join(chunkDir, file), 'utf8');
  const size = (content.length / 1024).toFixed(1);
  const mentions = [];
  if (content.includes('firebase')) mentions.push('firebase');
  if (content.includes('auth')) mentions.push('auth');
  if (content.includes('firestore')) mentions.push('firestore');
  if (content.includes('lucide')) mentions.push('lucide');
  if (content.includes('leaflet')) mentions.push('leaflet');
  if (content.includes('react-dom')) mentions.push('react-dom');
  if (content.includes('next/')) mentions.push('next');
  if (content.includes('translations') || content.includes('हर बच्चे')) mentions.push('locales/hi');
  
  console.log(`${file} (${size} KB): ${mentions.join(', ')}`);
}
