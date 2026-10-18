import fs from 'fs';
import path from 'path';

const appDir = path.resolve('.next/static/chunks/app');
function scanDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scanDir(full);
    else if (f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('firebase/auth') || content.includes('getAuth')) {
        console.log('Match in:', full);
      }
    }
  }
}
scanDir(appDir);
