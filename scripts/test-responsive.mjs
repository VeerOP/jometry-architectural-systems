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

(async () => {
  const server = await createStaticServer(3050);
  const browser = await chromium.launch();
  const pages = [
    'http://localhost:3050/index.html',
    'http://localhost:3050/service-wall.html',
    'http://localhost:3050/acoustics.html',
    'http://localhost:3050/living-wall.html',
    'http://localhost:3050/facade-light.html',
    'http://localhost:3050/specifications.html'
  ];

  const viewports = [
    { name: 'Mobile (iPhone SE - 375px)', width: 375, height: 667 },
    { name: 'Tablet (iPad - 768px)', width: 768, height: 1024 },
    { name: 'Laptop (1100px)', width: 1100, height: 800 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 }
  ];

  let hasErrors = false;

  for (const url of pages) {
    console.log(`\nTesting URL: ${url}`);
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(url, { waitUntil: 'networkidle' });

      // Check horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const isOverflowing = scrollWidth > clientWidth;

      // Verify Navbar position is fixed and sticking at top
      const navPosition = await page.evaluate(() => {
        const nav = document.querySelector('.navbar');
        if (!nav) return null;
        const style = window.getComputedStyle(nav);
        return {
          position: style.position,
          top: style.top,
          height: style.height
        };
      });

      // Scroll down and test sticky navbar
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(100);

      const navScrolledState = await page.evaluate(() => {
        const nav = document.querySelector('.navbar');
        const rect = nav.getBoundingClientRect();
        return {
          hasScrolledClass: nav.classList.contains('scrolled'),
          topBounding: rect.top
        };
      });

      // Test mobile menu toggle if under 1080px
      if (vp.width <= 1080) {
        const toggle = await page.$('#mobile-menu-toggle');
        if (toggle) {
          await toggle.click();
          await page.waitForTimeout(150);
          const isOpen = await page.evaluate(() => document.getElementById('mobile-menu-drawer')?.classList.contains('active'));
          const closeBtn = await page.$('#mobile-menu-close');
          if (closeBtn) await closeBtn.click();
          await page.waitForTimeout(150);
        }
      }

      // Test theme switch
      const themeBtn = await page.$('#theme-toggle-btn');
      if (themeBtn) {
        await themeBtn.click();
        await page.waitForTimeout(100);
      }

      if (errors.length > 0) {
        console.error(`  [FAIL] ${vp.name} Errors:`, errors);
        hasErrors = true;
      } else if (isOverflowing) {
        console.warn(`  [WARN] ${vp.name} Horizontal overflow: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
        hasErrors = true;
      } else if (navPosition.position !== 'fixed' || navScrolledState.topBounding !== 0) {
        console.error(`  [FAIL] ${vp.name} Navbar sticking issue: position=${navPosition.position}, topBounding=${navScrolledState.topBounding}`);
        hasErrors = true;
      } else {
        console.log(`  [PASS] ${vp.name} (Fixed Sticky Nav verified, scrolledClass: ${navScrolledState.hasScrolledClass})`);
      }

      await page.close();
    }
  }

  await browser.close();
  if (server) {
    server.close();
  }
  if (hasErrors) {
    console.log('\n❌ Tests finished with issues.');
    process.exit(1);
  } else {
    console.log('\n✅ All pages passed with 100% Fixed Sticky Nav, zero horizontal overflow, and clean responsiveness!');
  }
})();
