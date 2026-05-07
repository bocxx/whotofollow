import payload from '../data/whotofollow_creators.json';
import type { Creator, CreatorsPayload } from '../types/creator';

const data = payload as unknown as CreatorsPayload;

export function getAllCreators(): Creator[] {
  return data.creators;
}

export function getGeneratedAt(): string {
  return data.generated_at;
}

export function getBySlug(slug: string): Creator | undefined {
  return data.creators.find((c) => c.slug === slug);
}

export function getByPlatform(platform: string, limit = 200): Creator[] {
  return data.creators.filter((c) => c.primary_platform === platform).slice(0, limit);
}

export function getCounts() {
  const total = data.creators.length;
  const byPlatform: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  let cross = 0;
  let picks = 0;
  for (const c of data.creators) {
    byPlatform[c.primary_platform] = (byPlatform[c.primary_platform] ?? 0) + 1;
    if (c.platforms.length > 1) cross++;
    if (c.is_curator_pick) picks++;
    for (const tag of (c.tags ?? [])) {
      byCategory[tag] = (byCategory[tag] ?? 0) + 1;
    }
  }
  return { total, byPlatform, byCategory, cross, picks };
}

export function formatNumber(n?: number): string {
  if (n == null || isNaN(n)) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const platformLabels: Record<string, string> = {
  github: 'GitHub',
  youtube: 'YouTube',
  twitter: 'X / Twitter',
  bluesky: 'Bluesky',
  website: 'Website',
};

export const platformColors: Record<string, string> = {
  github: 'oklch(72% 0.10 250)',
  youtube: 'oklch(68% 0.20 25)',
  twitter: 'oklch(72% 0.13 230)',
  bluesky: 'oklch(72% 0.13 230)',
  website: 'oklch(70% 0.05 280)',
};

/** Human-friendly category labels (NL+EN — keep both langs simple). */
export const categoryLabels: Record<string, { nl: string; en: string }> = {
  claude: { nl: 'Claude', en: 'Claude' },
  coding: { nl: 'Coding', en: 'Coding' },
  agents: { nl: 'Agents', en: 'Agents' },
  beginners: { nl: 'Beginners', en: 'Beginners' },
  business: { nl: 'Business', en: 'Business' },
  research: { nl: 'Research', en: 'Research' },
  creative: { nl: 'Creatief', en: 'Creative' },
  fundamentals: { nl: 'Fundamenten', en: 'Fundamentals' },
  'tool-insights': { nl: 'Tool-inzichten', en: 'Tool insights' },
  official: { nl: 'Officieel', en: 'Official' },
  branding: { nl: 'Personal brand', en: 'Personal brand' },
};

export function categoryLabel(key: string, locale: 'nl' | 'en' = 'nl'): string {
  const c = categoryLabels[key];
  return c ? c[locale] : key;
}

/** Curator tiers — order also defines display priority. */
export const curatorTiers = ['must-follow', 'official', 'recommended', 'niche'] as const;

export const tierLabels: Record<string, { nl: string; en: string }> = {
  'must-follow': { nl: 'Top pick', en: 'Top pick' },
  'official': { nl: 'Officieel', en: 'Official' },
  'recommended': { nl: 'Aanrader', en: 'Recommended' },
  'niche': { nl: 'Niche', en: 'Niche' },
};

export function tierLabel(tier?: string, locale: 'nl' | 'en' = 'nl'): string {
  if (!tier) return '';
  const t = tierLabels[tier];
  return t ? t[locale] : tier;
}

export function curatorPicks(): Creator[] {
  return data.creators.filter((c) => c.is_curator_pick);
}
