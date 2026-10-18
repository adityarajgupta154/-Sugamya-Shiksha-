import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const overflowResults = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const overflowing = [];

    document.querySelectorAll("*").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1) {
        overflowing.push({
          tagName: el.tagName,
          className: el.className?.toString?.() || "",
          id: el.id || "",
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          docWidth,
          text: (el.textContent || "").slice(0, 60).replace(/\s+/g, " ").trim(),
        });
      }
    });

    return { docWidth, scrollWidth, overflowing };
  });

  console.log("=== OVERFLOW DEBUG RESULTS (360px viewport) ===");
  console.log("Document clientWidth:", overflowResults.docWidth);
  console.log("Document scrollWidth:", overflowResults.scrollWidth);
  console.log("Difference (overflow):", overflowResults.scrollWidth - overflowResults.docWidth);
  console.log("Total overflowing elements:", overflowResults.overflowing.length);
  console.log("\nTop overflowing elements:");
  overflowResults.overflowing.slice(0, 30).forEach((item, i) => {
    console.log(`[${i + 1}] <${item.tagName.toLowerCase()} class="${item.className}" id="${item.id}"> width=${item.width}px right=${item.right}px (+${item.right - item.docWidth}px) text="${item.text}"`);
  });

  await browser.close();
}

run().catch((err) => {
  console.error("Debug overflow script error:", err);
  process.exit(1);
});
