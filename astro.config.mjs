import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const isDev = process.argv.includes('dev');

// Per-URL lastmod in de sitemap — de hele site ververst in één wekelijks
// datamoment (zondag-export uit NewsFlux), dus generated_at ís de lastmod.
// Stuurt crawl-prioritering: Google ziet direct wanneer er nieuwe data staat.
const creatorsPayload = JSON.parse(
  readFileSync(new URL('./src/data/whotofollow_creators.json', import.meta.url), 'utf8'),
);
const dataLastmod = new Date(creatorsPayload.generated_at).toISOString();

export default defineConfig({
  site: 'https://whotofollow.online',
  output: 'static',
  adapter: isDev ? undefined : cloudflare(),
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Boldonse',
      cssVariable: '--font-boldonse',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      display: 'optional',
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['SF Mono', 'Menlo', 'monospace'],
      display: 'optional',
    },
  ],
  redirects: {
    // galaxy/network verwijderd in redesign; URL's staan nog in de Google-index
    '/galaxy': '/',
    '/network': '/',
    '/en/galaxy': '/en',
    '/en/network': '/en',
  },
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en-US' },
      },
      serialize(item) {
        item.lastmod = dataLastmod;
        return item;
      },
    }),
  ],
  build: { assets: 'assets' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
