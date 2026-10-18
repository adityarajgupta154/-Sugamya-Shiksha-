import fs from 'fs';

const pages = ['home', 'guidelines', 'school-directory', 'map', 'reports', 'admin'];

for (const name of pages) {
  const file = `lh-${name}.report.html`;
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(/window\.__LIGHTHOUSE_JSON__\s*=\s*(\{.*?\});<\/script>/s);
  if (!match) continue;
  const json = JSON.parse(match[1]);
  console.log(`\n=================== ${name.toUpperCase()} ===================`);
  console.log('Score:', Math.round(json.categories.performance.score * 100));
  console.log('FCP:', json.audits['first-contentful-paint']?.displayValue);
  console.log('LCP:', json.audits['largest-contentful-paint']?.displayValue);
  console.log('TBT:', json.audits['total-blocking-time']?.displayValue);
  console.log('CLS:', json.audits['cumulative-layout-shift']?.displayValue);
  console.log('Speed Index:', json.audits['speed-index']?.displayValue);
  
  console.log('Opportunities / Warnings:');
  const auditsToCheck = [
    'render-blocking-resources',
    'uses-responsive-images',
    'modern-image-formats',
    'total-byte-weight',
    'unused-javascript',
    'uses-text-compression',
    'server-response-time',
    'largest-contentful-paint-element'
  ];
  
  for (const k of auditsToCheck) {
    const a = json.audits[k];
    if (a && a.score !== null && a.score < 0.9) {
      console.log(`  * ${k}: ${a.displayValue || (a.details?.overallSavingsMs ? Math.round(a.details.overallSavingsMs) + 'ms' : a.score)}`);
      if (k === 'render-blocking-resources' && a.details?.items) {
        a.details.items.forEach(item => console.log(`      -> ${item.url} (${item.wastedMs}ms)`));
      }
      if (k === 'largest-contentful-paint-element' && a.displayValue) {
        console.log(`      -> ${a.displayValue}`);
      }
    }
  }
}
