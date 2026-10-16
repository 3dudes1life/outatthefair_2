import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { chromium, webkit } from 'playwright';

const port = 4182;
const baseURL = `http://127.0.0.1:${port}`;
const routes = ['/', '/locations/', '/riversidecountyfair/', '/sdfair/', '/orangecountyfair/', '/participate/', '/history/', '/contact/'];
const desktopWidths = [1024, 1275, 1440, 1920];
const destinations = [
  ['All locations', '/locations/'],
  ['Riverside County', '/riversidecountyfair/'],
  ['San Diego County', '/sdfair/'],
  ['Orange County', '/orangecountyfair/']
];

const root = resolve('.');
const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, baseURL).pathname);
  let file = resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
  if (!file.startsWith(root)) { response.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    response.writeHead(200, { 'content-type': contentTypes[extname(file)] || 'application/octet-stream' });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end('Not found');
  }
});
const startServer = () => new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
const stopServer = () => new Promise(resolve => server.close(resolve));

const isVisible = async page => page.locator('.main-nav .dropdown').evaluate(element =>
  getComputedStyle(element).display !== 'none'
);

const moveIntoMenu = async page => {
  const button = await page.locator('.main-nav .has-dropdown > button').boundingBox();
  if (!button) throw new Error('Fairs button is not measurable.');

  await page.mouse.move(4, button.y + button.height / 2);
  await page.mouse.move(button.x + button.width / 2, button.y + button.height / 2, { steps: 8 });
  if (!await isVisible(page)) throw new Error('Dropdown did not open on pointer entry.');

  const menu = await page.locator('.main-nav .dropdown').boundingBox();
  if (!menu) throw new Error('Open dropdown is not measurable.');

  // Cross the 10px visual gap through the dropdown's transparent bridge.
  await page.mouse.move(button.x + button.width / 2, menu.y - 5, { steps: 8 });
  await page.mouse.move(menu.x + 18, menu.y + 18, { steps: 8 });
  if (!await isVisible(page)) throw new Error('Dropdown closed while moving from Fairs into its menu.');
};

const exerciseDesktop = async browserType => {
  const browser = await browserType.launch({ headless: true });
  const page = await browser.newPage();
  for (let routeIndex = 0; routeIndex < routes.length; routeIndex += 1) {
    for (let widthIndex = 0; widthIndex < desktopWidths.length; widthIndex += 1) {
      const width = desktopWidths[widthIndex];
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${baseURL}${routes[routeIndex]}`, { waitUntil: 'networkidle' });
      await moveIntoMenu(page);

      for (const [label] of destinations) {
        await page.locator('.main-nav .dropdown').getByText(label, { exact: true }).hover();
        if (!await isVisible(page)) throw new Error(`Dropdown closed while hovering ${label} at ${width}px on ${routes[routeIndex]}.`);
      }

      const [label, expectedPath] = destinations[(routeIndex + widthIndex) % destinations.length];
      await page.locator('.main-nav .dropdown').getByText(label, { exact: true }).click();
      if (new URL(page.url()).pathname !== expectedPath) {
        throw new Error(`${label} did not navigate to ${expectedPath}.`);
      }
    }
  }

  await page.setViewportSize({ width: 1275, height: 900 });
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const control = page.locator('.main-nav .has-dropdown > button');
  await control.focus();
  await page.keyboard.press('Enter');
  if (!await isVisible(page)) throw new Error('Enter did not open the dropdown.');
  await page.keyboard.press('Escape');
  if (await isVisible(page)) throw new Error('Escape did not close the desktop dropdown.');

  await control.click();
  await page.mouse.click(20, 300);
  if (await isVisible(page)) throw new Error('Outside click did not close the desktop dropdown.');
  await browser.close();
};

const exerciseMobile = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
    await page.locator('.nav-toggle').click();
    await page.locator('.main-nav .has-dropdown > button').click();
    if (!await isVisible(page)) throw new Error(`Mobile Fairs menu did not open on ${route}.`);
    await page.keyboard.press('Escape');
    const isOpen = await page.locator('.nav-toggle').getAttribute('aria-expanded');
    if (isOpen !== 'false') throw new Error(`Mobile Escape did not close navigation on ${route}.`);
  }
  await browser.close();
};

try {
  await startServer();
  await exerciseDesktop(chromium);
  await exerciseMobile();
  try {
    await exerciseDesktop(webkit);
    console.log('Verified desktop pointer movement in Chromium and WebKit, plus mobile touch navigation.');
  } catch (error) {
    if (/Executable doesn't exist/.test(String(error))) {
      console.log('Verified desktop pointer movement in Chromium and mobile touch navigation; WebKit is not installed locally.');
    } else {
      throw error;
    }
  }
} finally {
  await stopServer();
}
