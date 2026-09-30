import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renderDoc(browser, htmlPath, pdfPath, title) {
  console.log(`\n=== Generating ${title} ===`);
  console.log(`Source: ${htmlPath}`);
  console.log(`Target: ${pdfPath}`);

  const page = await browser.newPage();
  
  // Set explicit portrait A4 viewport
  await page.setViewportSize({ width: 794, height: 1123 });

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle'
  });

  // Ensure fonts and images are fully rendered
  await page.evaluateHandle('document.fonts.ready');
  await page.waitForTimeout(1000);

  // Render strict A4 Portrait PDF
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: false,
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm'
    },
    displayHeaderFooter: false
  });

  console.log(`✓ Successfully created Portrait A4 PDF: ${pdfPath}`);
  await page.close();
}

async function generateAllPDFs() {
  console.log("Starting Playwright PDF Generation for Jometry / D'WALL Architectural Catalogues (A4 Portrait)...");

  const pdfDir = path.join(__dirname, '../pdf');
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const docs = [
    {
      title: "Master Architectural Catalogue (jometry-dwall-catalogue.pdf)",
      html: path.join(__dirname, '../src/print.html'),
      pdf: path.join(pdfDir, 'jometry-dwall-catalogue.pdf')
    },
    {
      title: "Living Wall & Biofiltration Catalogue (dwall-livingwall-brochure.pdf)",
      html: path.join(__dirname, '../dwall-livingwall-brochure.html'),
      pdf: path.join(pdfDir, 'dwall-livingwall-brochure.pdf')
    },
    {
      title: "Acoustic Indoor Panel Catalogue (dwall-acoustic-brochure.pdf)",
      html: path.join(__dirname, '../dwall-acoustic-brochure-v2.html'),
      pdf: path.join(pdfDir, 'dwall-acoustic-brochure.pdf')
    },
    {
      title: "Service Wall System Catalogue (dwall-service-wall-brochure.pdf)",
      html: path.join(__dirname, '../dwall-service-wall-brochure.html'),
      pdf: path.join(pdfDir, 'dwall-service-wall-brochure.pdf')
    }
  ];

  for (const doc of docs) {
    if (fs.existsSync(doc.html)) {
      await renderDoc(browser, doc.html, doc.pdf, doc.title);
    } else {
      console.warn(`File not found: ${doc.html}`);
    }
  }

  await browser.close();
  console.log("\n=======================================================");
  console.log("All A4 Portrait Architectural PDFs successfully generated!");
  console.log("=======================================================\n");
}

generateAllPDFs().catch(err => {
  console.error("PDF Generation Error:", err);
  process.exit(1);
});
