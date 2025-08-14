import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const OUTPUT_DIR = path.join(process.cwd(), 'public');
const BASE_URL = process.env.PREVIEW_BASE_URL || 'http://localhost:3000';
const USERNAME = 'qazwsx1995';
const PASSWORD = process.env.APP_PASSWORD || 'change_me_password';

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function takeScreenshots() {
  await ensureDir(OUTPUT_DIR);
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();

  // Home
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'preview-home.png') });

  // Login page
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'preview-login.png') });

  // Secure (perform login)
  await page.type('#username', USERNAME);
  await page.type('#password', PASSWORD);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'preview-secure.png') });

  await browser.close();
}

takeScreenshots().then(() => {
  // eslint-disable-next-line no-console
  console.log('Screenshots saved to /public');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});