/**
 * Roundups — evergreen, indexeerbare overzichtspagina's voor whotofollow.
 *
 * Naast de categorie-pagina's (/onderwerp/[cat]) zijn dit gecureerde
 * "wie volgen"-lijsten per platform + een must-follow flagship. Stabiele URL
 * die ter plekke ververst met de creator-data → uniek + zoekwaardig
 * ("beste AI-mensen om te volgen op X", "top AI YouTube-kanalen", …).
 * Vervangt de niet-indexeerbare /?platform=-gefilterde homepage-views.
 */
import { getByPlatform, curatorPicks } from './data';
import type { Creator } from '../types/creator';

export interface RoundupCopy {
  kicker: string;
  title: string;
  lead: string;
}

export type RoundupScope =
  | { kind: 'platform'; platform: string }
  | { kind: 'picks' };

export interface RoundupConfig {
  slug: string;
  scope: RoundupScope;
  icon: 'star' | 'github' | 'youtube' | 'twitter' | 'bluesky';
  nl: RoundupCopy;
  en: RoundupCopy;
}

export const ROUNDUPS: RoundupConfig[] = [
  {
    slug: 'must-follow',
    scope: { kind: 'picks' },
    icon: 'star',
    nl: {
      kicker: "Redactie's keuze",
      title: 'Must-follow AI-creators om nu te volgen',
      lead: 'Onze handmatig gecureerde shortlist van de AI-makers, -onderzoekers en -bouwers die het meest de moeite waard zijn om te volgen — over X, YouTube, GitHub en Bluesky heen.',
    },
    en: {
      kicker: "Editor's pick",
      title: 'Must-follow AI creators worth following now',
      lead: 'Our hand-curated shortlist of the AI builders, researchers and makers most worth following — across X, YouTube, GitHub and Bluesky.',
    },
  },
  {
    slug: 'github',
    scope: { kind: 'platform', platform: 'github' },
    icon: 'github',
    nl: {
      kicker: 'GitHub',
      title: 'Top AI-makers en -projecten om te volgen op GitHub',
      lead: 'De meest gevolgde AI- en machine-learning bouwers op GitHub — van framework-auteurs tot agent-ontwikkelaars, gerangschikt op volgers.',
    },
    en: {
      kicker: 'GitHub',
      title: 'Top AI builders to follow on GitHub',
      lead: 'The most-followed AI and machine-learning builders on GitHub — from framework authors to agent developers, ranked by followers.',
    },
  },
  {
    slug: 'youtube',
    scope: { kind: 'platform', platform: 'youtube' },
    icon: 'youtube',
    nl: {
      kicker: 'YouTube',
      title: 'Beste AI YouTube-kanalen om te volgen',
      lead: 'AI-uitleggers, tutorial-makers en onderzoekers met de beste YouTube-kanalen over kunstmatige intelligentie, gerangschikt op abonnees.',
    },
    en: {
      kicker: 'YouTube',
      title: 'Best AI YouTube channels to follow',
      lead: 'AI explainers, tutorial makers and researchers with the best YouTube channels on artificial intelligence, ranked by subscribers.',
    },
  },
  {
    slug: 'twitter',
    scope: { kind: 'platform', platform: 'twitter' },
    icon: 'twitter',
    nl: {
      kicker: 'X / Twitter',
      title: 'Beste AI-accounts om te volgen op X',
      lead: 'De AI-onderzoekers, -bouwers en -denkers met de meeste invloed op X (Twitter), gerangschikt op volgers — voor wie de AI-tijdlijn scherp wil houden.',
    },
    en: {
      kicker: 'X / Twitter',
      title: 'Best AI accounts to follow on X',
      lead: 'The AI researchers, builders and thinkers with the most influence on X (Twitter), ranked by followers — to keep your AI timeline sharp.',
    },
  },
  {
    slug: 'bluesky',
    scope: { kind: 'platform', platform: 'bluesky' },
    icon: 'bluesky',
    nl: {
      kicker: 'Bluesky',
      title: 'AI-makers om te volgen op Bluesky',
      lead: 'De groeiende AI-community op Bluesky — onderzoekers, bouwers en makers die daar actief zijn, gerangschikt op volgers.',
    },
    en: {
      kicker: 'Bluesky',
      title: 'AI creators to follow on Bluesky',
      lead: 'The growing AI community on Bluesky — researchers, builders and makers active there, ranked by followers.',
    },
  },
];

export function getRoundupConfig(slug: string): RoundupConfig | undefined {
  return ROUNDUPS.find((r) => r.slug === slug);
}

const TIER_ORDER: Record<string, number> = {
  'must-follow': 0, official: 1, recommended: 2, niche: 3,
};

export interface RoundupData {
  items: Creator[];
  total: number;
  top: Creator | null;
}

const followers = (c: Creator) => (c.stats as any)?.followers ?? 0;

export function getRoundupData(cfg: RoundupConfig, limit = 60): RoundupData {
  let pool: Creator[];
  if (cfg.scope.kind === 'picks') {
    pool = [...curatorPicks()].sort(
      (a, b) =>
        (TIER_ORDER[a.curator_tier ?? ''] ?? 9) - (TIER_ORDER[b.curator_tier ?? ''] ?? 9) ||
        followers(b) - followers(a),
    );
  } else {
    pool = getByPlatform(cfg.scope.platform, 2000).sort((a, b) => followers(b) - followers(a));
  }
  return {
    items: pool.slice(0, limit),
    total: pool.length,
    top: pool[0] ?? null,
  };
}
