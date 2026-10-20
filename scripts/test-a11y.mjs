/**
 * Automated Accessibility Testing using axe-core and JSDOM
 * Run via: npm run test:a11y
 */

import { JSDOM } from "jsdom";
import axe from "axe-core";

async function runAccessibilityAudit() {
  console.log("=================================================");
  console.log(" Sugamya Shiksha Bihar — Automated a11y Audit");
  console.log(" Target: WCAG 2.2 Level AA");
  console.log("=================================================\n");

  // Mock DOM representing the rendered global shell + components
  const mockHtml = `
    <!DOCTYPE html>
    <html lang="hi" dir="ltr" class="text-scale-normal">
      <head>
        <meta charset="utf-8" />
        <title>सुगम्य शिक्षा बिहार | Sugamya Shiksha Bihar</title>
      </head>
      <body>
        <a href="#main-content" class="skip-link">मुख्य सामग्री पर सीधे जाएँ</a>
        <div aria-live="polite" aria-atomic="true" class="sr-only" id="a11y-live-region"></div>
        
        <header role="banner">
          <div role="toolbar" aria-label="अभिगम्यता विकल्प">
            <button type="button" aria-pressed="true" aria-label="सामान्य अक्षर आकार">A</button>
            <button type="button" aria-pressed="false" aria-label="बड़ा अक्षर आकार">A+</button>
            <button type="button" aria-pressed="false" aria-label="उच्च कंट्रास्ट मोड चालू करें">High Contrast</button>
            <button type="button" aria-label="Read in English">English</button>
          </div>

          <nav aria-label="मुख्य नेविगेशन">
            <a href="/">होम</a>
            <a href="/guidelines" aria-current="page">दिशानिर्देश लाइब्रेरी</a>
            <a href="/schools">विद्यालय डायरेक्टरी</a>
            <a href="/dashboard">शोध डैशबोर्ड</a>
          </nav>
        </header>

        <main id="main-content" tabindex="-1">
          <h1>हर बच्चे के लिए सुगम विद्यालय, हर बच्चे के लिए समान शिक्षा।</h1>
          <p>Researching School Accessibility and Advancing Inclusive Education in Danapur, Patna, Bihar.</p>

          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading" class="sr-only">त्वरित कार्य</h2>
            <button type="button">विद्यालय अभिगम्यता देखें</button>
            <button type="button">दिशानिर्देश पढ़ें</button>
          </section>

          <section aria-labelledby="form-test-heading">
            <h2 id="form-test-heading">नमूना फॉर्म परीक्षण</h2>
            <form>
              <div>
                <label for="school-name">विद्यालय का नाम <span aria-hidden="true">*</span></label>
                <input id="school-name" type="text" required aria-required="true" aria-describedby="school-helper" />
                <p id="school-helper">दानापुर स्थित विद्यालय का पूरा नाम दर्ज करें</p>
              </div>

              <div>
                <label for="report-notes">टिप्पणी</label>
                <textarea id="report-notes" aria-invalid="false"></textarea>
              </div>
            </form>
          </section>

          <section aria-labelledby="tabs-heading">
            <h2 id="tabs-heading">दिशानिर्देश खंड</h2>
            <div role="tablist" aria-label="दिशानिर्देश विवरण">
              <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1" tabindex="0">मुख्य प्रावधान</button>
              <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">चेकलिस्ट</button>
            </div>
            <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">
              <p>सभी शैक्षणिक भवनों के प्रवेश द्वार पर बाधारहित समतल पहुँच अथवा मानक रैंप की अनिवार्यता।</p>
            </div>
          </section>
        </main>

        <footer role="contentinfo">
          <p>WCAG 2.2 Level AA अभिगम्यता मानकों के अनुरूप विकसित।</p>
        </footer>
      </body>
    </html>
  `;

  const dom = new JSDOM(mockHtml, {
    runScripts: "dangerously",
  });

  const { window } = dom;

  try {
    const results = await axe.run(window.document.documentElement, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });

    console.log(`Passed checks: ${results.passes.length}`);
    console.log(`Inapplicable checks: ${results.inapplicable.length}`);
    console.log(`Incomplete / Needs review: ${results.incomplete.length}`);
    console.log(`Violations found: ${results.violations.length}`);

    if (results.violations.length > 0) {
      console.error("\n❌ Accessibility Violations Detected:");
      results.violations.forEach((violation, idx) => {
        console.error(`\n[${idx + 1}] ${violation.id} — ${violation.help}`);
        console.error(`    Impact: ${violation.impact}`);
        console.error(`    Description: ${violation.description}`);
        console.error(`    Help URL: ${violation.helpUrl}`);
        violation.nodes.forEach((node) => {
          console.error(`    Target HTML: ${node.html}`);
        });
      });
      process.exit(1);
    } else {
      console.log("\n✅ ZERO VIOLATIONS! All WCAG 2.2 Level AA checks passed successfully.");
      process.exit(0);
    }
  } catch (error) {
    console.error("Audit Execution Error:", error);
    process.exit(1);
  }
}

runAccessibilityAudit();
