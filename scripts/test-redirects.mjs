// Test van de 301-worker (src/worker.ts). Kaart: aiblik/docs/features/satellieten-301.md
//
//   npm run test:redirects             zonder netwerk: vaste gevallen, elke URL uit de
//                                      bewaarde sitemap en de bewaarde bestanden
//   ... -- --doelen                    plus: elk doel geeft op www.aiblik.nl 200 zonder redirect
//   npm run test:live                  na de uitrol: elke oude URL live een 301 naar het
//                                      verwachte doel, de bewaarde bestanden 200, elk doel 200
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import worker, { redirectDoel } from '../src/worker.ts';

const DOEL = 'https://www.aiblik.nl';

const DOMEIN = 'whotofollow.online';
const BEWAAR = ['/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', '/favicon.svg'];
const CASES = [
  ['https://whotofollow.online/', '/mensen/'],
  ['http://whotofollow.online', '/mensen/'],
  ['https://www.whotofollow.online/', '/mensen/'],
  ['https://whotofollow.online/en/', '/mensen/'],
  ['https://whotofollow.online/ylecun/', '/mensen/'],
  ['https://whotofollow.online/en/ylecun', '/mensen/'],
  ['https://whotofollow.online/jeff-su/', '/mensen/'],
  ['https://whotofollow.online/onderwerp/claude/?x=1', '/mensen/'],
  ['https://whotofollow.online/en/topic/agents/', '/mensen/'],
  ['https://whotofollow.online/must-follow/', '/mensen/'],
  ['https://whotofollow.online/organisaties/', '/mensen/'],
  ['https://whotofollow.online/en/organisations/', '/mensen/'],
  ['https://whotofollow.online/twitter/', '/mensen/'],
  ['https://whotofollow.online/youtube/', '/mensen/'],
  ['https://whotofollow.online/github/', '/mensen/'],
  ['https://whotofollow.online/bluesky/', '/mensen/'],
  ['https://whotofollow.online/over/', '/over/'],
  ['https://whotofollow.online/en/about/', '/over/'],
  ['https://whotofollow.online/RSS.xml', '/rss.xml'],
  ['https://whotofollow.online/api/creators', '/mensen/'],
  ['https://whotofollow.online/llms.txt', '/mensen/'],
  ['https://whotofollow.online/%E0%A4%A', '/mensen/'],
];

const live = process.argv.includes('--live');
const doelenCheck = live || process.argv.includes('--doelen');

// 1. Vaste gevallen, ook met en zonder www, http, slash, hoofdletters en query.
for (const [van, naar] of CASES) {
  assert.equal(redirectDoel(van), DOEL + naar, van);
  const r = await worker.fetch(new Request(van));
  assert.equal(r.status, 301, van);
  assert.equal(r.headers.get('location'), DOEL + naar, van);
}
console.log(`✓ ${CASES.length} vaste gevallen`);

// 2. De bewaarde bestanden bestaan (Cloudflare serveert ze vóór de worker).
for (const pad of BEWAAR) assert.ok(existsSync(new URL(`../bewaar${pad}`, import.meta.url)), `bewaar${pad} ontbreekt`);
const robots = readFileSync(new URL('../bewaar/robots.txt', import.meta.url), 'utf8');
assert.match(robots, new RegExp(`Sitemap: https://${DOMEIN.replace('.', '\\.')}/sitemap-index\\.xml`));
assert.doesNotMatch(robots, /Disallow: \/\s*$/m, 'robots.txt mag niets afsluiten');
console.log(`✓ ${BEWAAR.length} bewaarde bestanden`);

// 3. Elke URL uit de laatste sitemap van de oude site.
const sitemap = readFileSync(new URL('../bewaar/sitemap-0.xml', import.meta.url), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert.ok(urls.length > 10, 'sitemap leeg?');
const verwacht = new Map();
const telling = new Map();
for (const u of urls) {
  const doel = redirectDoel(u);
  assert.ok(doel.startsWith(DOEL + '/'), u);
  verwacht.set(u, doel);
  telling.set(doel, (telling.get(doel) ?? 0) + 1);
}
console.log(`✓ ${urls.length} sitemap-URL's naar ${telling.size} doelen`);
for (const [doel, n] of [...telling].sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(5)}  ${doel}`);

async function inBatches(lijst, n, fn) {
  const fouten = [];
  for (let i = 0; i < lijst.length; i += n) {
    const uit = await Promise.all(lijst.slice(i, i + n).map(fn));
    fouten.push(...uit.filter(Boolean));
  }
  return fouten;
}

// 4. Elk doel geeft 200 op www.aiblik.nl, zonder tweede sprong.
if (doelenCheck) {
  const doelen = [...new Set([...telling.keys(), ...CASES.map(([, naar]) => DOEL + naar)])];
  const fouten = await inBatches(doelen, 8, async (d) => {
    const r = await fetch(d, { redirect: 'manual' });
    return r.status === 200 ? null : `${d} gaf ${r.status} ${r.headers.get('location') ?? ''}`;
  });
  assert.deepEqual(fouten, [], 'doelen die geen 200 geven');
  console.log(`✓ ${doelen.length} doelen geven 200 op www.aiblik.nl`);
}

// 5. Live: de oude adressen geven een 301 naar het verwachte doel.
if (live) {
  const fouten = await inBatches(BEWAAR, 4, async (pad) => {
    const r = await fetch(`https://${DOMEIN}${pad}`, { redirect: 'manual' });
    return r.status === 200 ? null : `${pad} gaf ${r.status}`;
  });
  const extra = CASES.map(([van]) => van).filter((v) => !v.startsWith('http:'));
  const lijst = [...new Set([...urls, ...extra])];
  fouten.push(...await inBatches(lijst, 12, async (u) => {
    const r = await fetch(u, { redirect: 'manual' });
    const loc = r.headers.get('location');
    return r.status === 301 && loc === redirectDoel(u) ? null : `${u} gaf ${r.status} ${loc ?? ''}`;
  }));
  if (fouten.length) console.error(fouten.slice(0, 30).join('\n'));
  assert.equal(fouten.length, 0, `${fouten.length} live fouten`);
  console.log(`✓ live: ${BEWAAR.length} bewaarde bestanden 200, ${lijst.length} oude URL's 301 naar het juiste doel`);
}
