import { chromium } from 'playwright';

(async () => {
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

      // Test mobile menu toggle if on mobile
      if (vp.width < 768) {
        const toggle = await page.$('#mobile-menu-toggle');
        if (toggle) {
          await toggle.click();
          await page.waitForTimeout(200);
          const isOpen = await page.evaluate(() => document.getElementById('mobile-menu-drawer')?.classList.contains('active'));
          const closeBtn = await page.$('#mobile-menu-close');
          if (closeBtn) await closeBtn.click();
          await page.waitForTimeout(200);
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
      } else {
        console.log(`  [PASS] ${vp.name} (scrollWidth: ${scrollWidth}px, clientWidth: ${clientWidth}px)`);
      }

      await page.close();
    }
  }

  await browser.close();
  if (hasErrors) {
    console.log('\n❌ Tests finished with issues.');
    process.exit(1);
  } else {
    console.log('\n✅ All pages passed flawlessly across Mobile, Tablet, and Desktop!');
  }
})();
