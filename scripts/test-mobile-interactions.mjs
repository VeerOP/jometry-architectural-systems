import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

function createStaticServer(port = 3052) {
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

(async () => {
  const server = await createStaticServer(3052);
  const browser = await chromium.launch();
  const pages = [
    { name: 'index', url: 'http://localhost:3052/index.html' },
    { name: 'service-wall', url: 'http://localhost:3052/service-wall.html' },
    { name: 'acoustics', url: 'http://localhost:3052/acoustics.html' },
    { name: 'living-wall', url: 'http://localhost:3052/living-wall.html' },
    { name: 'facade-light', url: 'http://localhost:3052/facade-light.html' },
    { name: 'specifications', url: 'http://localhost:3052/specifications.html' }
  ];

  const screenshotsDir = path.join(projectRoot, 'screenshots-mobile-interacted');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const pageInfo of pages) {
    console.log(`\nTesting page: ${pageInfo.name}`);
    const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
    
    await page.goto(pageInfo.url, { waitUntil: 'networkidle' });

    // Scroll down slowly to trigger all intersection observers
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 250;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 80);
      });
    });

    await page.waitForTimeout(300);

    // Take full page scrolled screenshot
    await page.screenshot({ path: path.join(screenshotsDir, `${pageInfo.name}-scrolled-375.png`), fullPage: true });

    // Test specific interactive elements on each page:
    if (pageInfo.name === 'index') {
      // Test mobile menu open and enquiry click
      await page.evaluate(() => window.scrollTo(0, 0));
      const menuBtn = await page.$('#mobile-menu-toggle');
      if (menuBtn) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(screenshotsDir, `index-mobile-menu-open.png`) });
        
        // Open enquiry modal from mobile drawer
        const drawerEnquireBtn = await page.$('.mobile-menu-drawer .btn-enquire-spec');
        if (drawerEnquireBtn) {
          await drawerEnquireBtn.click();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(screenshotsDir, `index-enquiry-modal-open.png`) });
          const closeMod = await page.$('#close-enquiry');
          if (closeMod) await closeMod.click();
          await page.waitForTimeout(200);
        }
      }

      // Test hero pillar tab click
      const acousticTab = await page.$('.hero-pillar-tab[data-pillar="acoustic"]');
      if (acousticTab) {
        await acousticTab.click();
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(screenshotsDir, `index-hero-tab-switched.png`) });
      }
    }

    if (pageInfo.name === 'service-wall') {
      // Test WallClick Assembly step simulation
      const step2Btn = await page.$('.sim-step-btn[data-step="2"]');
      if (step2Btn) {
        await step2Btn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(screenshotsDir, `service-wall-step2.png`) });
      }
      const step3Btn = await page.$('.sim-step-btn[data-step="3"]');
      if (step3Btn) {
        await step3Btn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(screenshotsDir, `service-wall-step3.png`) });
      }
    }

    if (pageInfo.name === 'acoustics') {
      // Test acoustic preset button click
      const presetAvBtn = await page.$('.acoustic-preset-btn[data-depth="180"]');
      if (presetAvBtn) {
        await presetAvBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(screenshotsDir, `acoustics-preset-180.png`) });
      }
    }

    if (pageInfo.name === 'specifications') {
      // Test filter button click
      const acousticFilter = await page.$('.filter-btn[data-filter="acoustic-control"]');
      if (acousticFilter) {
        await acousticFilter.click();
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(screenshotsDir, `specifications-filtered-acoustic.png`) });
      }

      // Test quick spec drawer
      const quickSpecBtn = await page.$('.btn-quick-spec');
      if (quickSpecBtn) {
        await quickSpecBtn.click();
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(screenshotsDir, `specifications-drawer-open.png`) });
        const closeDrawer = await page.$('#close-drawer');
        if (closeDrawer) await closeDrawer.click();
      }
    }

    await page.close();
  }

  await browser.close();
  if (server) server.close();
  console.log('Interactions test finished. Screenshots saved in /screenshots-mobile-interacted');
})();
