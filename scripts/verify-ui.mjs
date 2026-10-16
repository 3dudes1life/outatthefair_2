import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(resolve(root, 'assets/app.css'), 'utf8');
const app = readFileSync(resolve(root, 'assets/app.js'), 'utf8');
const required = [
  ['horizontal overflow protection', 'overflow-x:hidden'],
  ['mobile drawer breakpoint', '@media(max-width:900px)'],
  ['mobile dock breakpoint', '@media(max-width:760px)'],
  ['safe-area dock positioning', 'env(safe-area-inset-bottom'],
  ['keyboard focus ring', 'focus-visible'],
  ['reduced motion support', 'prefers-reduced-motion:reduce'],
  ['responsive two-column grid', 'grid-template-columns:repeat(2,minmax(0,1fr))'],
  ['responsive single-column grid', 'grid-template-columns:1fr!important'],
  ['location-card action alignment', 'justify-content:flex-end']
];

let failed = false;
for (const [label, marker] of required) {
  if (!css.includes(marker)) {
    console.error(`Missing UI safeguard: ${label}`);
    failed = true;
  }
}
for (const marker of ["label:'Home'", "label:'Fairs'", "label:'Story'", "label:'Contact'", "path:'locations/'"]) {
  if (!app.includes(marker)) {
    console.error(`Missing mobile navigation item: ${marker}`);
    failed = true;
  }
}

if (failed) process.exitCode = 1;
else console.log('Verified responsive grid, mobile dock, focus, motion, overflow, and location-card alignment safeguards.');
