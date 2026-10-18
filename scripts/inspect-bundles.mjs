import fs from 'fs';

const html = fs.readFileSync('lh-home.report.html', 'utf8');
const match = html.match(/window\.__LIGHTHOUSE_JSON__\s*=\s*(\{.*?\});<\/script>/s);
if (match) {
  const json = JSON.parse(match[1]);
  console.log('--- Network requests on Home: ---');
  const networkItems = json.audits['network-requests']?.details?.items || [];
  networkItems.forEach(item => {
    console.log(`${item.resourceType || 'other'} | ${Math.round(item.transferSize / 1024)} KB | ${Math.round(item.endTime - item.startTime)} ms | ${item.url.slice(0, 100)}`);
  });
  
  console.log('\n--- Unused JavaScript details: ---');
  const unusedItems = json.audits['unused-javascript']?.details?.items || [];
  unusedItems.forEach(item => {
    console.log(`${Math.round(item.wastedBytes / 1024)} KB wasted (${Math.round(item.wastedPercent)}%) of ${Math.round(item.totalBytes / 1024)} KB: ${item.url}`);
  });
}
