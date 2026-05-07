import rss from '@astrojs/rss';
import { getAllCreators, platformLabels } from '../lib/data';
import { siteConfig } from '../config/site';
import { useTranslations } from '../i18n/messages';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const creators = getAllCreators().slice(0, 200);
  const t = useTranslations('nl');
  const baseUrl = (context.site ?? siteConfig.url).toString();
  return rss({
    title: `${t.siteName} — ${t.siteTagline}`,
    description: t.siteDescription,
    site: baseUrl,
    items: creators.map((c) => ({
      title: `${c.name} — ${platformLabels[c.primary_platform]}`,
      description: c.bio || `Volg ${c.name} op ${platformLabels[c.primary_platform]}`,
      link: `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${c.slug}`,
      pubDate: new Date(),
      categories: c.platforms.map((p) => p.type).concat(c.tags || []).slice(0, 8),
    })),
    customData: '<language>nl-nl</language>',
  });
}
