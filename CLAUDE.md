# whotofollow.online — CLAUDE.md

<!-- Laatste review: 2026-10-09 (Fase 3 doc-refresh). Volgende: Q1 2027 of bij ingrijpende data/stack-wijziging. -->

**whotofollow.online** is een Astro-site die een AI-expert creator-directory biedt per platform (Bluesky, GitHub, Twitter, YouTube) met interactieve visualisaties. De data komt volledig uit het NewsFlux-systeem en wordt wekelijks (zondag 03:50) vernieuwd.

---

## Relatie met NewsFlux

**Data-bron:** `~/Projects/DEPLOYED/newsflux`

Data wordt elke zondag om 04:50 CET gegenereerd en naar deze repo gekopieerd via:
```bash
cd ~/Projects/DEPLOYED/newsflux
source venv/bin/activate
python3 src/export_for_sites.py --copy-to-sites
```

### Data-bestanden

| Bestand | Bron (newsflux) | Inhoud |
|---|---|---|
| `src/data/whotofollow_creators.json` | `data/reports/whotofollow_creators.json` | ~800 AI-experts met platform-metadata, categorieën, follower-counts, bio's |

**Gegevensbronnen in newsflux:** `github_users`, `youtube_channels`, `tweet_authors`, `creator_categories`, `github_trending_snapshots`.

**Hoe de data wordt opgebouwd (zondag-cron volgorde):**
1. `categorize_creators.py` (03:00) — rules-based categorisatie
2. `export_for_sites.py` (03:35) — initial export
3. `categorize_creators_llm.py` (03:40) — LLM top-up (Haiku, ~€0.10)
4. `export_for_sites.py --copy-to-sites` (03:50) — final export + copy naar deze repo

---

## Pagina's & URL's

| URL | Inhoud |
|---|---|
| `/` (NL) + `/en` (EN) | Home — top creators per platform + stats |
| `/[slug]` + `/en/[slug]` | Creator detail-pagina |
| `/bluesky` | Bluesky AI-creators |
| `/github` | GitHub repo-owners in AI |
| `/twitter` | Twitter AI-experts |
| `/youtube` | YouTube AI-kanalen |
| `/must-follow` | Curator's top picks |
| `/onderwerp` | Topic-based curations |
| `/over` + `/en/about` | Info-pagina |

---

## Tech stack

- **Framework:** Astro (static output)
- **Hosting:** Cloudflare Workers (`wrangler.toml` → `preview_urls = false`: geen publieke versie-previews)
- **Data-laag:** `src/lib/data.ts` — `getAllCreators()`, `getByPlatform()`, `getBySlug()`, `curatorPicks()`, `getCounts()`
- **Build-keten:** `npm run build` draait in volgorde `verify:links` → OG-image-generatie → `astro build` → `postbuild` HTML-completeness-check. Een gebroken link of lege HTML blokkeert de build (en dus de deploy).
- **Deploy:** auto via GitHub Actions bij push naar `main` (`.github/workflows/deploy.yml`); handmatig lokaal met `npm run deploy`.

---

## Build-poorten (sinds aug-sep 2026)

Twee gates die een stille regressie moeten tegenhouden; faalt een van beide, dan faalt `npm run build` en gaat niets live.

- **`verify:links` (pre-build)** — `scripts/verify-links.mjs`. Loopt alle interne links na vóór Astro ook maar begint; aangezet 24 sep 2026 om een deploy met een dode link te voorkomen.
- **`postbuild` HTML-check** — `scripts/check-html-complete.mjs`. Verplaatst 21 aug 2026 van pre-build naar postbuild, omdat het deploy-pad in Actions anders de check omzeilde.

Beide hangen in `package.json`-scripts; nooit stilletjes uitzetten zonder PR-noot.

---

## SEO — AI-crawler-signalen (okt 2026)

- **`public/llms.txt`** staat live (sinds 8 okt 2026) — compacte orientatie voor LLM-crawlers (ChatGPT, Claude, Perplexity): wie zijn we, wat is er te vinden, welke sitemap gebruiken.
- **`public/robots.txt`** staat in **één gegroepeerde regel** (sinds 8 okt 2026) zodat zowel `Disallow` als Cloudflare's `Content-Signal: train=no` ook geldt voor AI-bots, niet alleen voor Google/Bing. Wijzig je deze file, splits de regels nooit terug uit — AI-bots lezen alleen het eerste groep-blok dat op hun UA matcht.
- **Trailing-slash-beleid:** veilig, live geverifieerd (zie `../CLAUDE.md` → "SEO-valkuil"). Geen `run_worker_first` in `wrangler.toml`, dus Cloudflare's eigen slash-redirect doet het werk.

---

## Deployen

```bash
cd ~/Projects/DEPLOYED/whotofollow.online
npm run build && npx wrangler deploy
```

Standaard: **push naar `main`** triggert de deploy-workflow (vereist repo-secret `CLOUDFLARE_API_TOKEN`). Data-updates (zondag-cron) worden door NewsFlux gecommit+gepusht, dus die gaan vanzelf live.

---

## Workflow

1. **Automatisch**: zondag ~03:50 cron (newsflux `export_for_sites.py --copy-to-sites`) kopieert verse `whotofollow_creators.json`, de push-cron pakt het binnen 30 min op, GH Actions deployt.
2. **Handmatig forceren**: `cd newsflux && python3 src/export_for_sites.py --copy-to-sites`, verifieer `src/data/whotofollow_creators.json`, dan committen (de push-cron doet de rest) of lokaal `npm run build && npx wrangler deploy`.

---

## Relatie met andere sites

| Site | Relatie |
|---|---|
| `feedzzz.online` | Zusterproject — zelfde data-export cron, zelfde deploy-patroon |
| `hetlaatsteainieuws.nl` | Primaire nieuwssite — deelt `tweet_authors` + `articles_flat` databron |
| `debesteaitools.nl` | Tools-platform — deelt `github_users` + `youtube_channels` databron |
