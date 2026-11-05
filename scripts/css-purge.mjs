/**
 * css-purge — snoeit ongebruikte regels uit de GLOBALE stylesheet (src/styles/main.css)
 * tijdens `astro build`. Bron van waarheid: astro-starter; sites kopiëren dit bestand
 * ongewijzigd, instellingen alleen in `css-purge.config.json`.
 *
 * Waarom: het ontwerpsysteem (animations/components/prose/utilities) is naar meerdere
 * repo's gekopieerd en bevat veel klassen die een site nooit gebruikt (meting 5 nov 2026:
 * 40-45% van de gzip-CSS). Op sites met SSR-pagina's (artikelen) kan je de gebouwde HTML
 * niet scannen, dus zoeken we naar klassen in de BRON: alle woorden in src/ (zonder
 * src/styles), public/*.js|html|svg en astro.config.mjs.
 *
 * Een regel blijft staan als ELKE klasse en elk id in zijn selector als woord in de bron
 * voorkomt. Dynamische klassen blijven behouden via voorvoegsel (`pillar-${x}` laat alle
 * `pillar-*` staan) en achtervoegsel (`${x}-card`). Alles wat geen klasse of id is
 * (tags, attributen, :root, @keyframes, @font-face) blijft ongemoeid. Daarnaast verwijdert
 * hij custom properties die nergens via var(--x) of als tekst in de bron voorkomen.
 *
 * Alleen actief bij een productiebuild (NODE_ENV=production) en alleen voor CSS die uit
 * src/styles/ komt. Scoped <style>-blokken in .astro-componenten blijven buiten schot.
 * Uitschakelen: CSS_PURGE=0 npx astro build.
 *
 * Controle na een wijziging: `npx astro build` toont "[css-purge] ..." met hoeveel regels
 * en bytes zijn verwijderd. Mist een klasse die wel gebruikt wordt, zet hem dan in
 * `safelist` (exacte naam of /regex/) of `safelistPrefixes` in css-purge.config.json.
 */
import fs from 'node:fs';
import path from 'node:path';

const SCAN_EXT = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mdx', '.md', '.json', '.html', '.svg']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git', '.claude', '.wrangler', 'styles']);

function walk(dir, out, { skipStyles }) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name) && !(e.name === 'styles' && !skipStyles)) continue;
      walk(p, out, { skipStyles });
    } else if (SCAN_EXT.has(path.extname(e.name))) {
      out.push(p);
    }
  }
}

function loadConfig(root) {
  const f = path.join(root, 'css-purge.config.json');
  const base = { safelist: [], safelistPrefixes: [], extraScan: [] };
  if (!fs.existsSync(f)) return base;
  return { ...base, ...JSON.parse(fs.readFileSync(f, 'utf8')) };
}

function buildTokens(root, cfg) {
  const files = [];
  walk(path.join(root, 'src'), files, { skipStyles: true });
  walk(path.join(root, 'public'), files, { skipStyles: true });
  for (const extra of cfg.extraScan) walk(path.join(root, extra), files, { skipStyles: true });
  for (const f of ['astro.config.mjs']) if (fs.existsSync(path.join(root, f))) files.push(path.join(root, f));

  const words = new Set();   // woorden, ook met voorloop- of sluitstreepje
  const vars = new Set();    // --custom-props genoemd in de bron
  for (const f of files) {
    // grote data-bestanden in public/ (json) slaan we over; klassen staan niet in data
    let text;
    try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }
    if (text.length > 3_000_000) continue;
    for (const m of text.matchAll(/-?-?[A-Za-z_][\w-]*/g)) {
      const w = m[0];
      if (w.startsWith('--')) vars.add(w);
      else words.add(w);
    }
  }
  // voor- en achtervoegsels van dynamisch samengestelde klassen
  const prefixes = [...words].filter((w) => w.length >= 3 && /[-_]$/.test(w));
  const suffixes = [...words].filter((w) => w.length >= 4 && w.startsWith('-'));
  return { words, vars, prefixes, suffixes, nFiles: files.length };
}

function unescapeCss(s) { return s.replace(/\\(.)/g, '$1'); }

/** Verwijder :not(...) en :where(...) (met geneste haakjes) — klassen daarin tellen niet mee. */
function stripFunctional(sel) {
  let out = '';
  let i = 0;
  const re = /:(?:not|where)\(/;
  while (i < sel.length) {
    const m = sel.slice(i).match(re);
    if (!m) { out += sel.slice(i); break; }
    out += sel.slice(i, i + m.index);
    let j = i + m.index + m[0].length;
    let depth = 1;
    while (j < sel.length && depth > 0) { if (sel[j] === '(') depth++; else if (sel[j] === ')') depth--; j++; }
    i = j;
  }
  return out;
}

export default function cssPurge(opts = {}) {
  const root = opts.root ?? process.cwd();
  let ctx = null; // lazy: pas scannen bij het eerste CSS-bestand uit src/styles
  const stats = { rulesRemoved: 0, propsRemoved: 0, bytesBefore: 0, bytesAfter: 0, files: 0 };
  let announced = false;

  function init() {
    const cfg = loadConfig(root);
    const t = buildTokens(root, cfg);
    const safeExact = new Set(cfg.safelist.filter((s) => !/^\/.*\/$/.test(s)));
    const safeRegex = cfg.safelist.filter((s) => /^\/.*\/$/.test(s)).map((s) => new RegExp(s.slice(1, -1)));
    const safePrefix = cfg.safelistPrefixes;
    ctx = { ...t, safeExact, safeRegex, safePrefix };
  }

  const classKnown = (name) => {
    if (ctx.words.has(name) || ctx.safeExact.has(name)) return true;
    if (ctx.safeRegex.some((r) => r.test(name))) return true;
    if (ctx.safePrefix.some((p) => name.startsWith(p))) return true;
    if (ctx.prefixes.some((p) => name.startsWith(p))) return true;
    if (ctx.suffixes.some((s) => name.endsWith(s))) return true;
    return false;
  };

  const selectorKept = (sel) => {
    const s = stripFunctional(sel);
    // attribuutselectoren kunnen punten/hekjes bevatten: eerst weg
    const noAttr = s.replace(/\[[^\]]*\]/g, '');
    for (const m of noAttr.matchAll(/\.((?:\\.|[\w-])+)/g)) {
      if (!classKnown(unescapeCss(m[1]))) return false;
    }
    for (const m of noAttr.matchAll(/#((?:\\.|[\w-])+)/g)) {
      if (!classKnown(unescapeCss(m[1]))) return false;
    }
    return true;
  };

  return {
    postcssPlugin: 'css-purge',
    Once(cssRoot, { result }) {
      if (process.env.CSS_PURGE === '0') return;
      if (process.env.NODE_ENV !== 'production') return;
      const from = (result.opts && result.opts.from) || '';
      if (!/[\\/]src[\\/]styles[\\/]/.test(from)) return;
      if (!ctx) init();
      stats.files++;
      stats.bytesBefore += cssRoot.toString().length;

      cssRoot.walkRules((rule) => {
        const parent = rule.parent;
        if (parent && parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
        const sels = rule.selectors;
        if (!sels) return;
        const kept = sels.filter(selectorKept);
        if (kept.length === 0) { rule.remove(); stats.rulesRemoved++; }
        else if (kept.length !== sels.length) rule.selectors = kept;
      });
      // lege at-rules (media/layer/supports/container) opruimen; @layer-volgorde zonder blok blijft
      let again = true;
      while (again) {
        again = false;
        cssRoot.walkAtRules((a) => {
          if (a.nodes && a.nodes.length === 0 && /^(media|supports|container|layer|scope|starting-style)$/i.test(a.name)) { a.remove(); again = true; }
        });
      }
      // dode custom properties (niet via var() en niet als tekst in de bron)
      for (let pass = 0; pass < 4; pass++) {
        const used = new Set(ctx.vars);
        cssRoot.walkDecls((d) => {
          for (const m of d.value.matchAll(/var\(\s*(--[\w-]+)/g)) used.add(m[1]);
        });
        cssRoot.walkAtRules('property', (a) => used.add(a.params.trim()));
        let removed = 0;
        cssRoot.walkDecls((d) => {
          if (d.prop.startsWith('--') && !used.has(d.prop)) { d.remove(); removed++; }
        });
        stats.propsRemoved += removed;
        cssRoot.walkRules((r) => { if (r.nodes && r.nodes.length === 0) r.remove(); });
        if (!removed) break;
      }
      stats.bytesAfter += cssRoot.toString().length;
      if (!announced) {
        announced = true;
        process.on('exit', () => {
          console.log(`[css-purge] ${stats.rulesRemoved} regels en ${stats.propsRemoved} custom properties verwijderd uit src/styles (${stats.bytesBefore} → ${stats.bytesAfter} bytes, ${ctx.nFiles} bronbestanden gescand)`);
        });
      }
    },
  };
}
cssPurge.postcss = true;
