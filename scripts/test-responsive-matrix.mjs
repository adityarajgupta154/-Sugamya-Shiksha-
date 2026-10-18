import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const WIDTHS = [320, 360, 390, 412, 600, 768, 1024, 1280, 1440, 1920];
const ROUTES = [
  { path: "/", name: "home" },
  { path: "/schools", name: "schools" },
  { path: "/learn-accessibility", name: "learn" },
  { path: "/guidelines", name: "guidelines" },
  { path: "/report-barrier", name: "report-barrier" },
  { path: "/reports", name: "reports" },
  { path: "/tracker", name: "tracker" },
];

const SCREENSHOT_DIR = path.resolve("public/responsive-audit-results");
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  let totalFailures = 0;

  console.log("=== STARTING FULL RESPONSIVE AUDIT MATRIX ===");

  // 1. Test standard widths on all key routes
  for (const w of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width: w, height: 800 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const r of ROUTES) {
      try {
        await page.goto(`http://localhost:3000${r.path}`, { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(600);

        const check = await page.evaluate(() => {
          const docEl = document.documentElement;
          const clientWidth = docEl.clientWidth;
          const scrollWidth = docEl.scrollWidth;
          const delta = scrollWidth - clientWidth;
          return { clientWidth, scrollWidth, delta };
        });

        const passed = check.delta <= 1; // 1px rounding tolerance
        if (!passed) {
          totalFailures++;
          console.log(`❌ OVERFLOW on ${r.name} at ${w}px: scroll=${check.scrollWidth}px, client=${check.clientWidth}px (delta=+${check.delta}px)`);
        } else {
          console.log(`✓ ${r.name} at ${w}px: PASS`);
        }

        results.push({
          route: r.name,
          width: w,
          height: 800,
          clientWidth: check.clientWidth,
          scrollWidth: check.scrollWidth,
          delta: check.delta,
          passed,
        });

        // Screenshot key widths: 360, 768, 1440 for before/after evidence
        if ([360, 768, 1440].includes(w) && ["home", "schools", "learn"].includes(r.name)) {
          const screenshotPath = path.join(SCREENSHOT_DIR, `${r.name}-${w}px.png`);
          await page.screenshot({ path: screenshotPath, fullPage: false });
        }
      } catch (err) {
        console.error(`Error testing ${r.name} at ${w}px:`, err.message);
        totalFailures++;
      }
    }
    await context.close();
  }

  // 2. Landscape Phone (800x360)
  {
    const context = await browser.newContext({
      viewport: { width: 800, height: 360 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const check = await page.evaluate(() => {
      const docEl = document.documentElement;
      return { clientWidth: docEl.clientWidth, scrollWidth: docEl.scrollWidth, delta: docEl.scrollWidth - docEl.clientWidth };
    });
    const passed = check.delta <= 1;
    if (!passed) totalFailures++;
    results.push({
      route: "home-landscape",
      width: 800,
      height: 360,
      clientWidth: check.clientWidth,
      scrollWidth: check.scrollWidth,
      delta: check.delta,
      passed,
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "home-landscape-800x360.png") });
    await context.close();
  }

  // 3. Hindi Locale Test (360px)
  {
    const context = await browser.newContext({
      viewport: { width: 360, height: 800 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/?lang=hi", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    // Click language toggle button to make sure Hindi is active
    const langBtn = await page.$("button:has-text('हि')");
    if (langBtn) await langBtn.click().catch(() => {});
    await page.waitForTimeout(600);

    const check = await page.evaluate(() => {
      const docEl = document.documentElement;
      return { clientWidth: docEl.clientWidth, scrollWidth: docEl.scrollWidth, delta: docEl.scrollWidth - docEl.clientWidth };
    });
    const passed = check.delta <= 1;
    if (!passed) totalFailures++;
    results.push({
      route: "home-hindi",
      width: 360,
      height: 800,
      clientWidth: check.clientWidth,
      scrollWidth: check.scrollWidth,
      delta: check.delta,
      passed,
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "home-hindi-360px.png") });
    await context.close();
  }

  await browser.close();

  console.log("\n=======================================================");
  console.log(`AUDIT RESULTS: ${results.length} test configurations evaluated`);
  console.log(`Total Failures (scrollWidth > clientWidth): ${totalFailures}`);
  console.log("=======================================================\n");

  const sampleResults = results.filter((r) => [320, 360, 412, 768, 1440, 1920].includes(r.width));
  console.table(sampleResults.map((r) => ({
    Route: r.route,
    Width: `${r.width}px`,
    Client: `${r.clientWidth}px`,
    Scroll: `${r.scrollWidth}px`,
    Delta: `${r.delta}px`,
    Status: r.passed ? "PASS" : "FAIL",
  })));

  if (totalFailures > 0) {
    console.error("FAIL: Horizontal scroll overflow detected!");
    process.exit(1);
  } else {
    console.log("SUCCESS: All responsive breakpoints passed with zero horizontal overflow!");
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("Fatal audit matrix error:", err);
  process.exit(1);
});
