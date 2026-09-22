// Build guard (content review, finding N20). The Tabler icon font is subset to the icons the site uses, so an icon
// added later would show as a blank square. Runs after `astro build` (see package.json) and fails the build if any
// built page or script uses a `ti-<name>` icon that the subset CSS doesn't define.
// Fix: run `python scripts/subset-icons.py`, then build again.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const css = readFileSync(join(DIST, 'vendor/tabler-icons-2.47.0/tabler-icons.min.css'), 'utf8');
const available = new Set([...css.matchAll(/\.(ti-[a-z0-9-]+):before/g)].map((m) => m[1]));
// Names that aren't Tabler icons at all (listed by subset-icons.py): they show blank with or without the subset.
const unknown = new Set(((css.match(/\/\* unknown: ([^*]*)\*\//) || [])[1] || '').trim().split(/\s+/).filter(Boolean));

const used = new Map(); // icon -> first file that uses it
const note = (icon, file) => { if (!used.has(icon)) used.set(icon, file); };
const scan = (file) => {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (/^ti-[a-z0-9-]+$/.test(c)) note(c, file);
  }
  for (const m of text.matchAll(/\bti (ti-[a-z0-9-]+)/g)) note(m[1], file); // 'ti ti-name' built in scripts
};
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== 'vendor') walk(p); }
    else if (/\.(html|js)$/.test(name)) scan(p);
  }
};
walk(DIST);

for (const [icon, file] of used) {
  if (unknown.has(icon)) console.warn(`check-icons: warning: ${icon} is not a Tabler icon, so it shows blank (e.g. ${file}).`);
}
const missing = [...used].filter(([icon]) => !available.has(icon) && !unknown.has(icon));
if (missing.length) {
  console.error(`check-icons: ${missing.length} icon(s) used but missing from the icon-font subset:`);
  for (const [icon, file] of missing) console.error(`  ${icon}  (e.g. ${file})`);
  console.error('Run `python scripts/subset-icons.py` (needs: pip install fonttools brotli), then build again.');
  process.exit(1);
}
const blank = [...used.keys()].filter((icon) => unknown.has(icon)).length;
console.log(`check-icons: all ${used.size - blank} Tabler icons used are in the subset (${available.size} defined)` +
  (blank ? `; ${blank} unknown name(s), see the warnings above.` : '.'));
