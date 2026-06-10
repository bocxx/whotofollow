# whotofollow.online — CLAUDE.md

**whotofollow.online** is een Astro-site die een AI-expert creator-directory biedt per platform (Bluesky, GitHub, Twitter, YouTube) met interactieve visualisaties. De data komt volledig uit het NewsFlux-systeem en wordt wekelijks vernieuwd.

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
- **Hosting:** Cloudflare Workers
- **Data-laag:** `src/lib/data.ts` — `getAllCreators()`, `getByPlatform()`, `getBySlug()`, `curatorPicks()`, `getCounts()`
- **Build:** `npm run build` (genereert OG-images, daarna Astro build)
- **Deploy:** GitHub Actions bij push naar `main` (`.github/workflows/deploy.yml`); handmatig kan met `npm run deploy`

---

## Deployen

```bash
cd ~/Projects/DEPLOYED/whotofollow.online
npm run build && npx wrangler deploy
```

**Auto-deploy via GitHub Actions bij push naar `main`** zodra het repo-secret `CLOUDFLARE_API_TOKEN` gezet is (`gh secret set CLOUDFLARE_API_TOKEN -R bocxx/whotofollow`); tot die tijd skipt de workflow en is handmatig deployen nodig. Data-updates (zondag) gaan pas live na een commit+push (of handmatige deploy).

---

## Workflow

1. Wacht op zondag ~04:50 cron (newsflux `export_for_sites.py --copy-to-sites`)
2. Of draai handmatig: `cd newsflux && python3 src/export_for_sites.py --copy-to-sites`
3. Verifieer `src/data/whotofollow_creators.json` is bijgewerkt
4. `npm run build && npx wrangler deploy`

---

## Relatie met andere sites

| Site | Relatie |
|---|---|
| `feedzzz.online` | Zusterproject — zelfde data-export cron, zelfde deploy-patroon |
| `hetlaatsteainieuws.nl` | Primaire nieuwssite — deelt `tweet_authors` + `articles_flat` databron |
| `debesteaitools.nl` | Tools-platform — deelt `github_users` + `youtube_channels` databron |
