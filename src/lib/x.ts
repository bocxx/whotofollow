/**
 * X-signalen — helpers en teksten voor het veld `x` op X-accounts.
 * "Raak" = een post over AI met minstens drie keer zoveel likes als de mediaan
 * van hetzelfde account (basislijn 90 dagen, venster 30 dagen).
 */
import { getByPlatform } from './data';
import type { Creator } from '../types/creator';
import type { Locale } from '../i18n/messages';

export function formatShare(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function formatFactor(factor: number, locale: Locale = 'nl'): string {
  const n = factor.toLocaleString(locale === 'nl' ? 'nl-NL' : 'en-US', { maximumFractionDigits: 1 });
  return `${n}×`;
}

/** X-accounts met minstens één uitschieter, vaakst raak eerst. */
export function getXHits(limit = 15): Creator[] {
  return getByPlatform('twitter', 2000)
    .filter((c) => (c.x?.uitschieters_30d ?? 0) > 0 && c.x?.beste_post)
    .sort((a, b) =>
      (b.x!.uitschieters_30d - a.x!.uitschieters_30d) ||
      (b.x!.beste_post!.factor - a.x!.beste_post!.factor))
    .slice(0, limit);
}

export const xCopy = {
  nl: {
    detailHeading: 'Op X',
    share: 'Posts over AI',
    hits: 'Keer raak in 30 dagen',
    followed: 'Volgen wij rechtstreeks',
    yes: 'ja',
    no: 'nee',
    bestPost: 'Beste post',
    method: 'Raak is een post over AI die minstens drie keer zoveel likes haalde als wat hetzelfde account normaal haalt. Likes zijn een momentopname.',
    listHeading: 'Vaakst raak in de laatste 30 dagen',
    shareShort: 'over AI',
    hitsShort: 'raak',
  },
  en: {
    detailHeading: 'On X',
    share: 'Posts about AI',
    hits: 'Hits in 30 days',
    followed: 'Followed directly by us',
    yes: 'yes',
    no: 'no',
    bestPost: 'Best post',
    method: 'A hit is a post about AI that got at least three times the likes the same account normally gets. Likes are a snapshot.',
    listHeading: 'Most hits in the last 30 days',
    shareShort: 'about AI',
    hitsShort: 'hits',
  },
} as const;
