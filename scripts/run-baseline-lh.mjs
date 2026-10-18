import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('reports/lighthouse');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { name: 'Admin', path: '/admin', fileKey: 'admin' },
  { name: 'Home', path: '/', fileKey: 'home' },
  { name: 'Guidelines', path: '/guidelines', fileKey: 'guidelines' },
  { name: 'Schools', path: '/schools', fileKey: 'schools' },
  { name: 'Map', path: '/map', fileKey: 'map' },
  { name: 'Survey', path: '/survey', fileKey: 'survey' },
];

const results = [];

for (const r of routes) {
  console.log(`\n========================================`);
  console.log(`Running Lighthouse for ${r.name} (http://localhost:3000${r.path})...`);
  const baseOut = path.join(outDir, `${r.fileKey}-baseline`);
  
  try {
    execSync(`npx.cmd lighthouse http://localhost:3000${r.path} --chrome-flags="--headless" --output=json,html --output-path="${baseOut}" --only-categories=performance`, { stdio: 'pipe' });
    
    const jsonPath = `${baseOut}.report.json`;
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const net = data.audits['network-requests']?.details?.items || [];
      const totalBytes = net.reduce((acc, cur) => acc + (cur.transferSize || 0), 0);
      const jsRequests = net.filter(item => item.resourceType === 'Script');
      const jsBytes = jsRequests.reduce((acc, cur) => acc + (cur.transferSize || 0), 0);
      
      const record = {
        name: r.name,
        path: r.path,
        score: Math.round((data.categories.performance?.score || 0) * 100),
        fcp: data.audits['first-contentful-paint']?.displayValue || 'N/A',
        lcp: data.audits['largest-contentful-paint']?.displayValue || 'N/A',
        tbt: data.audits['total-blocking-time']?.displayValue || 'N/A',
        totalRequests: net.length,
        totalTransferKB: (totalBytes / 1024).toFixed(1),
        jsTransferKB: (jsBytes / 1024).toFixed(1),
      };
      results.push(record);
      console.log(`Completed ${r.name}: Score=${record.score}, FCP=${record.fcp}, LCP=${record.lcp}, TBT=${record.tbt}, Requests=${record.totalRequests}, JS=${record.jsTransferKB} KB`);
    }
  } catch (err) {
    console.error(`Failed on ${r.name}:`, err.message);
  }
}

fs.writeFileSync(path.join(outDir, 'baseline-summary.json'), JSON.stringify(results, null, 2));
console.log('\n--- BASELINE SUMMARY ---');
console.table(results);
