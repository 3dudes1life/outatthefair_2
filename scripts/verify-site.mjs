import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'locations/index.html', 'riversidecountyfair/index.html', 'sdfair/index.html', 'orangecountyfair/index.html', 'participate/index.html'];
const required = {
  'index.html': ['All Belong', '2011', '2027', 'riversidecountyfair/', 'sdfair/', 'orangecountyfair/'],
  'locations/index.html': ['Find your fair', 'Prospective location', 'No 2027 event or official fair partnership has been announced'],
  'riversidecountyfair/index.html': ['Prospective location', 'no confirmed 2027 event or official fair partnership', 'Contact OATF'],
  'sdfair/index.html': ['Since 2011', 'No date, stage or entertainment has been announced'],
  'orangecountyfair/index.html': ['Since 2019', 'No date, stage or entertainment has been announced'],
  'participate/index.html': ['Entertainment Applications', 'Nonprofit &amp; Community Applications', 'Applications are not open yet.']
};

let failed = false;
for (const page of pages) {
  const absolute = resolve(root, page);
  const html = readFileSync(absolute, 'utf8');
  for (const marker of ['<title>', 'name="description"', 'property="og:title"', 'property="og:description"', 'id="main"']) {
    if (!html.includes(marker)) {
      console.error(`${page}: missing ${marker}`);
      failed = true;
    }
  }
  for (const text of required[page]) {
    if (!html.includes(text)) {
      console.error(`${page}: missing expected content: ${text}`);
      failed = true;
    }
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|tel:|#)/.test(url)) continue;
    const target = resolve(dirname(absolute), url);
    if (!existsSync(target)) {
      console.error(`${page}: missing local asset or route: ${url}`);
      failed = true;
    }
  }
}

const riverside = readFileSync(resolve(root, 'riversidecountyfair/index.html'), 'utf8').toLowerCase();
for (const prohibited of ['returns to the desert', 'see you in 2027 at out at the fair']) {
  if (riverside.includes(prohibited)) {
    console.error(`riversidecountyfair/index.html: prohibited confirmation language: ${prohibited}`);
    failed = true;
  }
}

const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
for (const route of ['/', '/locations/', '/riversidecountyfair/', '/sdfair/', '/orangecountyfair/', '/participate/']) {
  if (!sitemap.includes(`https://outatthefair.com${route}`)) {
    console.error(`sitemap.xml: missing ${route}`);
    failed = true;
  }
}
if (!robots.includes('Sitemap: https://outatthefair.com/sitemap.xml')) {
  console.error('robots.txt: missing production sitemap declaration');
  failed = true;
}
if (readFileSync(resolve(root, 'CNAME'), 'utf8').trim() !== 'outatthefair.com') {
  console.error('CNAME: expected outatthefair.com');
  failed = true;
}
const app = readFileSync(resolve(root, 'assets/app.js'), 'utf8');
if (!app.includes("WIX_SIGNUP_URL: ''") || !app.includes('button.remove()')) {
  console.error('signup: unconfigured public CTA is not disabled');
  failed = true;
}

const nativeRoutes = ['/', '/locations/', '/riversidecountyfair/', '/sdfair/', '/orangecountyfair/', '/participate/'];
const redirects = new Map([
  ['/partner', '/contact/'], ['/nonprofit', '/participate/'],
  ['/alaskastatefair', '/locations/'], ['/solanocountyfair', '/locations/'], ['/alamedacountyfair', '/locations/'],
  ['/marincountyfair', '/locations/'], ['/californiastatefair', '/locations/'], ['/sonomacountyfair', '/locations/'],
  ['/montereycountyfair', '/locations/'], ['/washingtoncountyfair', '/locations/'], ['/newmexicostatefair', '/locations/'],
  ['/shop', '/'], ['/giveaways', '/']
]);
const inventory = readFileSync(resolve(root, 'docs/wix-url-migration-inventory.csv'), 'utf8');
const bulkRedirects = readFileSync(resolve(root, 'docs/cloudflare-bulk-redirects.csv'), 'utf8');
if (nativeRoutes.length + redirects.size !== 19) {
  console.error('migration: expected exactly 19 legacy URLs');
  failed = true;
}
for (const route of nativeRoutes) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}index.html`;
  const legacyPath = route === '/' ? '/' : route.slice(0, -1);
  if (!existsSync(resolve(root, file)) || !inventory.includes(`${legacyPath},${route},native GitHub Pages page`)) {
    console.error(`migration: native route is not ready: ${route}`);
    failed = true;
  }
}
for (const [source, target] of redirects) {
  const line = `outatthefair.com${source},https://outatthefair.com${target},301,TRUE,FALSE,FALSE,FALSE`;
  if (!inventory.includes(`${source},${target},Cloudflare 301`) || !bulkRedirects.includes(line)) {
    console.error(`migration: missing redirect ${source} -> ${target}`);
    failed = true;
  }
  if (redirects.has(target)) {
    console.error(`migration: redirect chain detected: ${source} -> ${target}`);
    failed = true;
  }
}

if (failed) process.exitCode = 1;
else console.log(`Verified ${pages.length} launch pages and all 19 legacy URL migration outcomes.`);
