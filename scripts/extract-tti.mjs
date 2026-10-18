import fs from 'fs';

const pages = ['home', 'guidelines', 'school-directory', 'map', 'reports', 'admin'];

for (const name of pages) {
  const file = `lh-${name}.report.html`;
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(/window\.__LIGHTHOUSE_JSON__\s*=\s*(\{.*?\});<\/script>/s);
  if (!match) continue;
  const json = JSON.parse(match[1]);
  console.log(`\n=== ${name.toUpperCase()} ===`);
  const audits = json.audits;
  console.log('INP / Interaction:', audits['interaction-to-next-paint']?.displayValue || audits['experimental-interaction-to-next-paint']?.displayValue || 'N/A in single-load');
  console.log('Max Potential FID:', audits['max-potential-fid']?.displayValue);
  console.log('TBT:', audits['total-blocking-time']?.displayValue);
  console.log('LCP:', audits['largest-contentful-paint']?.displayValue);
  console.log('FCP:', audits['first-contentful-paint']?.displayValue);
  console.log('Speed Index:', audits['speed-index']?.displayValue);
  console.log('Time to Interactive (TTI):', audits['interactive']?.displayValue);
}
