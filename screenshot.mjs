import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:5173';

const pages = [
  { route: '/', name: 'homepage', width: 1440, height: 900 },
  { route: '/auth', name: 'auth', width: 1440, height: 900 },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const { route, name, width, height } of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 3000));
      const fp = path.join(OUT, `${name}.png`);
      await page.screenshot({ path: fp, fullPage: false });
      const stat = fs.statSync(fp);
      console.log(`✓ ${name} (${route}) — ${(stat.size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.log(`✗ ${name} (${route}) — ${err.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('\nAll done!');
})();
