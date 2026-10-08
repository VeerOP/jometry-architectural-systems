import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

function createStaticServer(port = 3051) {
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
  const server = await createStaticServer(3051);
  const browser = await chromium.launch();
  const pages = [
    { name: 'index', url: 'http://localhost:3051/index.html' },
    { name: 'service-wall', url: 'http://localhost:3051/service-wall.html' },
    { name: 'acoustics', url: 'http://localhost:3051/acoustics.html' },
    { name: 'living-wall', url: 'http://localhost:3051/living-wall.html' },
    { name: 'facade-light', url: 'http://localhost:3051/facade-light.html' },
    { name: 'specifications', url: 'http://localhost:3051/specifications.html' }
  ];

  const viewports = [
    { name: 'Mobile_Small_360', width: 360, height: 740 },
    { name: 'Mobile_iPhoneSE_375', width: 375, height: 667 },
    { name: 'Mobile_iPhone13_390', width: 390, height: 844 },
    { name: 'Tablet_768', width: 768, height: 1024 }
  ];

  const screenshotsDir = path.join(projectRoot, 'screenshots-mobile');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const pageInfo of pages) {
    console.log(`\n==============================================`);
    console.log(`Auditing: ${pageInfo.name} (${pageInfo.url})`);
    console.log(`==============================================`);

    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const consoleErrors = [];
      page.on('pageerror', err => consoleErrors.push(err.message));
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });

      // Check overflow elements
      const overflowReport = await page.evaluate((vpWidth) => {
        const issues = [];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          // ignore invisible elements or drawer/modals that are offscreen by design
          if (rect.width === 0 || rect.height === 0) continue;
          if (el.closest('.mobile-menu-drawer:not(.active)') || el.closest('.drawer-overlay:not(.active)') || el.closest('.modal-overlay:not(.active)')) continue;
          
          if (rect.right > vpWidth + 1) {
            issues.push({
              tag: el.tagName,
              className: el.className,
              id: el.id,
              right: rect.right,
              width: rect.width,
              vpWidth: vpWidth
            });
          }
        }
        return issues;
      }, vp.width);

      // Check touch targets under 36px
      const smallTouchTargets = await page.evaluate(() => {
        const smalls = [];
        const buttons = document.querySelectorAll('button, a.btn, a.nav-link, input, select');
        for (const btn of buttons) {
          if (!btn.offsetParent) continue; // hidden
          const rect = btn.getBoundingClientRect();
          if (rect.height < 32 || rect.width < 32) {
            smalls.push({
              tag: btn.tagName,
              text: btn.innerText?.slice(0, 25) || btn.id || btn.className,
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            });
          }
        }
        return smalls;
      });

      console.log(`Viewport [${vp.name}]:`);
      if (consoleErrors.length > 0) {
        console.log(`  ❌ Console Errors (${consoleErrors.length}):`, consoleErrors);
      }
      if (overflowReport.length > 0) {
        console.log(`  ⚠️ Overflow elements (${overflowReport.length}):`);
        overflowReport.slice(0, 5).forEach(issue => {
          console.log(`     <${issue.tag} class="${issue.className}" id="${issue.id}"> width=${issue.width} right=${issue.right} (viewport=${issue.vpWidth})`);
        });
      } else {
        console.log(`  ✅ Zero horizontal overflow`);
      }

      if (smallTouchTargets.length > 0) {
        console.log(`  ℹ️ Small touch targets: ${smallTouchTargets.length}`);
      }

      // Take a full page screenshot on 375px
      if (vp.width === 375) {
        const screenshotPath = path.join(screenshotsDir, `${pageInfo.name}-mobile-375.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
      }

      await page.close();
    }
  }

  await browser.close();
  if (server) server.close();
  console.log('\nAudit complete! Mobile screenshots saved to /screenshots-mobile');
})();
