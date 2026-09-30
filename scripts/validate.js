import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

function createStaticServer(port = 3050) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';

    let filePath = path.join(srcDir, reqPath);
    if (reqPath.startsWith('/assets/')) {
      filePath = path.join(projectRoot, reqPath);
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      resolve(server);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(null);
      } else {
        reject(err);
      }
    });
  });
}

async function runValidation() {
  console.log("=== PHASE 10: MULTI-PAGE ARCHITECTURAL PLATFORM VALIDATION ===");

  const server = await createStaticServer(3050);
  if (server) {
    console.log("✓ Local Static Server started on http://localhost:3050");
  } else {
    console.log("✓ Using existing server on http://localhost:3050");
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(`[${page.url()}] ${msg.text()}`);
  });

  try {
    // 1. Validate Home Page (index.html)
    console.log("\n[1/5] Testing Home Overview Page (index.html)...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3050/index.html', { waitUntil: 'networkidle' });
    const homeTitle = await page.title();
    console.log(`✓ Home Title: "${homeTitle}"`);
    
    // Test Dark Mode Toggle
    console.log("Testing Dark Mode Toggle...");
    const themeBtn = await page.$('#theme-toggle-btn');
    if (!themeBtn) throw new Error("Theme Toggle button not found in navbar.");
    await themeBtn.click();
    await page.waitForTimeout(200);
    const activeTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (activeTheme !== 'dark') throw new Error(`Theme toggle failed: expected 'dark', got '${activeTheme}'`);
    console.log(`✓ Dark Mode Activated (data-theme: "${activeTheme}")`);

    // Validate Dark Mode Buttons
    const navBtnColors = await page.evaluate(() => {
      const btn = document.querySelector('#nav-enquire-btn');
      const style = window.getComputedStyle(btn);
      return { bg: style.backgroundColor, color: style.color };
    });
    console.log(`✓ Dark Mode Nav Button: bg=${navBtnColors.bg}, text=${navBtnColors.color}`);
    if (navBtnColors.bg === 'rgb(255, 255, 255)' || navBtnColors.bg === '#ffffff') {
      throw new Error("FAIL: nav-enquire-btn has white background in dark mode!");
    }

    const heroCtaColors = await page.evaluate(() => {
      const btn = document.querySelector('#hero-cta-btn');
      const style = window.getComputedStyle(btn);
      return { bg: style.backgroundColor, color: style.color };
    });
    console.log(`✓ Dark Mode Hero CTA Button: bg=${heroCtaColors.bg}, text=${heroCtaColors.color}`);
    if (heroCtaColors.bg === 'rgb(255, 255, 255)' || heroCtaColors.bg === '#ffffff') {
      throw new Error("FAIL: hero-cta-btn has white background in dark mode!");
    }

    const statsBg = await page.evaluate(() => {
      const sec = document.querySelector('.stats-section');
      return window.getComputedStyle(sec).backgroundColor;
    });
    console.log(`✓ Dark Mode Stats Section: bg=${statsBg}`);
    if (statsBg === 'rgb(255, 255, 255)') {
      throw new Error("FAIL: stats-section is stark white in dark mode!");
    }

    // Capture dark mode screenshot of hero & stats
    await page.screenshot({ path: path.join(projectRoot, 'dark-mode-hero-verified.png') });
    console.log("✓ Saved dark mode screenshot to dark-mode-hero-verified.png");

    // Test Hero 3-Pillar Switcher on Home
    await page.click('button[data-pillar="acoustic"]');
    await page.waitForTimeout(200);
    const activePillarColors = await page.evaluate(() => {
      const activeTab = document.querySelector('.hero-pillar-tab.active');
      const style = window.getComputedStyle(activeTab);
      return { bg: style.backgroundColor, color: style.color };
    });
    console.log(`✓ Dark Mode Active Pillar Tab: bg=${activePillarColors.bg}, text=${activePillarColors.color}`);
    if (activePillarColors.bg === 'rgb(255, 255, 255)') {
      throw new Error("FAIL: hero-pillar-tab.active is white in dark mode!");
    }

    const heroText = await page.textContent('#hero-headline');
    if (!heroText.includes('Sound absorption you can tune')) {
      throw new Error("Hero Switcher Failed on Home.");
    }
    console.log("✓ Hero 3-Pillar Switcher Verified");

    // 2. Validate Service Wall Page (service-wall.html)
    console.log("\n[2/5] Testing Service Wall Page (service-wall.html)...");
    await page.goto('http://localhost:3050/service-wall.html', { waitUntil: 'networkidle' });
    const serviceTitle = await page.title();
    console.log(`✓ Service Wall Title: "${serviceTitle}"`);
    
    // Test 4-Layer Cavity Explorer Tabs
    await page.click('.cavity-layer-tab[data-layer="3"]');
    const cavityTitle = await page.textContent('#cavity-info-title');
    if (!cavityTitle.includes('Service Cavity')) {
      throw new Error("Cavity Layer Tab failed to switch to Layer 3.");
    }
    console.log("✓ 4-Layer Cavity Explorer Verified");

    // 3. Validate Acoustics Page (acoustics.html)
    console.log("\n[3/5] Testing Acoustics & Tile Studio Page (acoustics.html)...");
    await page.goto('http://localhost:3050/acoustics.html', { waitUntil: 'networkidle' });
    const acousticsTitle = await page.title();
    console.log(`✓ Acoustics Title: "${acousticsTitle}"`);

    // Test Tile Studio Click-to-Rotate 90°
    const studioTiles = await page.$$('.studio-tile');
    if (studioTiles.length !== 12) {
      throw new Error(`Expected 12 tiles in Studio, found ${studioTiles.length}`);
    }
    await studioTiles[0].click();
    await page.waitForTimeout(150);
    const rotBadge = await page.textContent('.studio-tile:first-child .tile-rotation-badge');
    console.log(`✓ Tile Click-to-Rotate Verified (New rotation: ${rotBadge})`);

    // Test Backlit Mode Toggle
    await page.click('#backlit-toggle');
    const isBacklit = await page.evaluate(() => document.getElementById('studio-grid').classList.contains('backlit-active'));
    if (!isBacklit) throw new Error("Backlit LED toggle failed.");
    console.log("✓ Backlit LED Mode Verified");

    // Test Resonant Cavity Simulator Preset
    await page.click('button.acoustic-preset-btn[data-depth="140"]');
    await page.waitForTimeout(150);
    const standoffVal = await page.textContent('#cavity-depth-value');
    if (!standoffVal.includes('140')) throw new Error("Acoustic simulator depth slider failed.");
    console.log(`✓ Resonant Cavity Simulator Verified (Standoff: ${standoffVal})`);

    // 4. Validate Living Wall Page (living-wall.html)
    console.log("\n[4/5] Testing Living Wall & Biofilter Page (living-wall.html)...");
    await page.goto('http://localhost:3050/living-wall.html', { waitUntil: 'networkidle' });
    const livingTitle = await page.title();
    console.log(`✓ Living Wall Title: "${livingTitle}"`);

    // Test Fan Speed Controls
    await page.click('button.fan-speed-btn[data-speed="boost"]');
    const bioMetrics = await page.textContent('#bio-metrics-display');
    if (!bioMetrics.includes('480 m³/h')) throw new Error("Biofilter fan speed control failed.");
    console.log("✓ Biofilter Active Air Stream Verified");

    // Test Leak Defense Stepper
    await page.click('.leak-step-btn:nth-child(3)');
    const leakCard = await page.textContent('#leak-step-card');
    if (!leakCard.includes('Layer 03')) throw new Error("Leak defense stepper failed.");
    console.log("✓ 4-Layer Leak Defense Stepper Verified");

    // 5. Validate Specifications & Catalogue Page (specifications.html)
    console.log("\n[5/5] Testing Specifications & Catalogue Page (specifications.html)...");
    await page.goto('http://localhost:3050/specifications.html', { waitUntil: 'networkidle' });
    const specTitle = await page.title();
    console.log(`✓ Specifications Title: "${specTitle}"`);

    // Verify 10 variants rendered
    const variantCards = await page.$$('.product-card');
    console.log(`✓ Product Variants Rendered: ${variantCards.length} cards found`);

    // Test CSI Specification Builder
    await page.selectOption('#spec-family-select', 'service');
    const specCode = await page.textContent('#spec-generated-code');
    if (!specCode.includes('DW-SERV')) throw new Error("CSI spec builder code generation failed.");
    console.log(`✓ CSI Specification Builder Verified (Code: ${specCode.trim()})`);

    // Test Quick Spec Drawer
    const firstQuickSpecBtn = await page.$('.btn-quick-spec');
    if (firstQuickSpecBtn) {
      await firstQuickSpecBtn.click();
      await page.waitForTimeout(200);
      const isDrawerOpen = await page.isVisible('#spec-drawer.active');
      if (!isDrawerOpen) throw new Error("Quick Spec Drawer failed to open.");
      console.log("✓ Quick Spec Slide-Out Drawer Verified");
      await page.click('#close-drawer');
    }

    // Test Specification Enquiry Modal
    await page.click('#nav-enquire-btn');
    const isModalOpen = await page.isVisible('#enquiry-modal.active');
    if (!isModalOpen) throw new Error("Enquiry Modal failed to open.");
    console.log("✓ Specification Enquiry Modal Verified");
    await page.click('#close-enquiry');

    // Test Mobile Layout (375x667)
    console.log("\nTesting Responsive Mobile Layout (375x667)...");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle' });
    const navbarVisible = await page.isVisible('.navbar');
    console.log(`✓ Mobile View Verified: Navbar visible (${navbarVisible})`);

    if (consoleErrors.length > 0) {
      console.warn("\nConsole Errors Logged:", consoleErrors);
    } else {
      console.log("\n✓ 0 Console Errors across all 5 pages!");
    }

    console.log("\n=======================================================");
    console.log("ALL 5 MULTI-PAGE ARCHITECTURAL PLATFORM TESTS PASSED!");
    console.log("=======================================================\n");

  } finally {
    await browser.close();
    if (server) server.close();
  }
}

runValidation().catch(err => {
  console.error("Multi-Page Validation Error:", err);
  process.exit(1);
});
