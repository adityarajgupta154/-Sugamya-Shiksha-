import http from 'http';

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Creating new Chrome tab...');
  const target = await getJson('http://localhost:9222/json/new?http://localhost:3000/');
  console.log('Target created:', target.id);
  const wsUrl = target.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Wait 2s for home page hydration
  await new Promise(r => setTimeout(r, 2500));

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  }

  const routesToTest = [
    { name: 'School Directory', selector: 'a[href="/schools"]', path: '/schools', check: 'document.body.innerText.includes("School Accessibility Directory") || document.body.innerText.includes("विद्यालय सुगम्यता निर्देशिका")' },
    { name: 'Guidelines', selector: 'a[href="/guidelines"]', path: '/guidelines', check: 'document.body.innerText.includes("Guidelines Library") || document.body.innerText.includes("दिशानिर्देश लाइब्रेरी")' },
    { name: 'Map', selector: 'a[href="/map"]', path: '/map', check: 'document.body.innerText.includes("Danapur School Accessibility Map") || document.body.innerText.includes("विद्यालय सुगम्यता मानचित्र")' },
    { name: 'Reports', selector: 'a[href="/reports"]', path: '/reports', check: 'document.body.innerText.includes("Research Publications Hub") || document.body.innerText.includes("शोध प्रलेखन केंद्र")' },
    { name: 'Admin', selector: null, directNav: '/admin', path: '/admin', check: 'document.body.innerText.includes("Admin Login") || document.body.innerText.includes("प्रशासक लॉगिन") || document.body.innerText.includes("प्रशासनिक") || document.body.innerText.includes("Admin Dashboard")' },
  ];

  console.log('\n--- Measuring Click-to-Content Timing ---');
  const timings = [];

  for (const r of routesToTest) {
    // Navigate home first
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(res => setTimeout(res, 1200));

    if (r.directNav) {
      const start = Date.now();
      await send('Page.navigate', { url: 'http://localhost:3000' + r.directNav });
      let loaded = false;
      let elapsed = 0;
      while (!loaded && elapsed < 10000) {
        await new Promise(res => setTimeout(res, 50));
        elapsed = Date.now() - start;
        loaded = await evaluate(r.check);
      }
      timings.push({ name: r.name, path: r.path, clickToContentMs: elapsed });
      console.log(`Route ${r.name} (${r.path}): ${elapsed} ms`);
    } else {
      // Find element and click
      const start = Date.now();
      const clickSuccess = await evaluate(`
        (() => {
          const el = document.querySelector('${r.selector}');
          if (el) { el.click(); return true; }
          return false;
        })()
      `);

      if (!clickSuccess) {
        console.log(`Element ${r.selector} not found on page!`);
        continue;
      }

      let loaded = false;
      let elapsed = 0;
      while (!loaded && elapsed < 10000) {
        await new Promise(res => setTimeout(res, 30));
        elapsed = Date.now() - start;
        loaded = await evaluate(r.check);
      }
      timings.push({ name: r.name, path: r.path, clickToContentMs: elapsed });
      console.log(`Route ${r.name} (${r.path}): Click-to-Content = ${elapsed} ms`);
    }
  }

  console.log('\n--- Summary Timings ---');
  console.table(timings);

  // Close tab
  await getJson(`http://localhost:9222/json/close/${target.id}`);
  ws.close();
}

run().catch(console.error);
