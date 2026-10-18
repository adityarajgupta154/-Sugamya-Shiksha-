import { execSync } from 'child_process';
import fs from 'fs';

const routes = [
  { name: 'Home', path: '/' },
  { name: 'Guidelines', path: '/guidelines' },
  { name: 'School Directory', path: '/schools' },
  { name: 'Map', path: '/map' },
  { name: 'Reports', path: '/reports' },
  { name: 'Admin', path: '/admin' }
];

const results = [];

for (const r of routes) {
  console.log(`Running Lighthouse for ${r.name} (${r.path})...`);
  const outPath = `lh-${r.name.toLowerCase().replace(/\s+/g, '-')}.report.html`;
  try {
    execSync(`npx lighthouse http://localhost:3000${r.path} --chrome-flags="--headless" --output=html --output-path="./${outPath}" --only-categories=performance`, { stdio: 'pipe' });
    const html = fs.readFileSync(outPath, 'utf8');
    const match = html.match(/window\.__LIGHTHOUSE_JSON__\s*=\s*(\{.*?\});<\/script>/s);
    if (match) {
      const data = JSON.parse(match[1]);
      results.push({
        name: r.name,
        path: r.path,
        score: Math.round(data.categories.performance.score * 100),
        fcp: data.audits['first-contentful-paint']?.displayValue,
        lcp: data.audits['largest-contentful-paint']?.displayValue,
        tbt: data.audits['total-blocking-time']?.displayValue,
        cls: data.audits['cumulative-layout-shift']?.displayValue,
        speedIndex: data.audits['speed-index']?.displayValue,
      });
      console.log(`Finished ${r.name}: Score=${results[results.length-1].score}, LCP=${results[results.length-1].lcp}, TBT=${results[results.length-1].tbt}`);
    }
  } catch (err) {
    console.error(`Error auditing ${r.name}:`, err.message);
  }
}

fs.writeFileSync('before-metrics.json', JSON.stringify(results, null, 2));
console.log('Results saved to before-metrics.json:');
console.table(results);
