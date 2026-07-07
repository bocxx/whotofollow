export type Locale = 'nl' | 'en';
export const LOCALES: Locale[] = ['nl', 'en'];
export const DEFAULT_LOCALE: Locale = 'nl';

export const messages = {
  nl: {
    siteName: 'whotofollow',
    siteDescription: 'Wie volg je voor AI? Een gecureerde directory van makers, onderzoekers en bedrijven over GitHub, YouTube, Twitter en Bluesky.',
    siteTagline: 'Wie volg je voor AI?',

    nav: {
      everyone: 'Iedereen',
      github: 'GitHub',
      youtube: 'YouTube',
      twitter: 'Twitter',
      bluesky: 'Bluesky',
      about: 'Over',
      organisations: 'Organisaties',
    },

    hero: {
      graph: 'Creator graph',
      updated: 'Bijgewerkt',
      titleA: 'Wie volg je',
      titleB: 'voor AI?',
      sub: (total: number, cross: number) =>
        `${total} gecureerde makers, onderzoekers en bedrijven verspreid over GitHub, YouTube, Twitter en Bluesky — ${cross} hebben we al gekoppeld over meerdere platforms.`,
    },

    filters: {
      everyone: 'Iedereen',
      cross: 'Multi-platform',
      picks: 'Editor\'s picks',
      categoryAll: 'Alle onderwerpen',
      categoryHeading: 'Onderwerp',
    },

    detail: {
      back: 'Terug naar overzicht',
      openOn: 'Open op',
      platforms: 'Platforms',
      stats: 'Stats',
      location: 'Locatie',
      worksAt: 'Werkt bij',
      organization: 'Organization',
    },

    category: {
      titlePrefix: 'AI-creators in',
      hero: (cat: string, n: number) => `${n} makers, onderzoekers en bedrijven die over ${cat.toLowerCase()} schrijven en bouwen — gecureerd én algoritmisch geselecteerd.`,
      editorsHeading: 'Editor\'s picks',
      editorsEmpty: 'Nog geen handmatig gecureerde picks in deze categorie.',
      othersHeading: 'Alle creators in deze categorie',
      othersEmpty: 'Nog geen andere creators in deze categorie.',
      otherCategoriesHeading: 'Andere onderwerpen',
      backToAll: '← Alle creators',
    },

    about: {
      title: 'Over whotofollow',
      whoHeading: 'Wie staan erop',
      whoIntro: (n: number) =>
        `${n} makers, onderzoekers en bedrijven die actief zijn rond AI, verzameld uit vier platforms:`,
      sourceGH: 'owners van trending AI-repos, met bio + cross-platform link via twitter_username',
      sourceYT: 'channels met substantieel publiek, country en abonnees',
      sourceTW: 'geverifieerde accounts die actief zijn over AI (gefilterd op activiteit, niet op celebrity-volume)',
      sourceBSKY: 'vroege adopters en nieuwsbronnen die AI bespreken',
      cross: (n: number, updated: string) => `${n} creators hebben we al cross-platform gekoppeld. Laatste update: ${updated}.`,
      criteriaHeading: 'Selectiecriteria',
      criteriaBody: 'We tonen makers die actief gemarkeerd zijn als AI-relevant in onze database, met minstens 100 volgers op hun primaire platform én meetbare activiteit in de afgelopen 60 dagen. Twitter-accounts moeten Blue-verified zijn om filterruis (gekochte volgers) te beperken.',
      relatedHeading: 'Verwante sites',
      relatedBody: 'Wil je ook zien wat ze maken? Bekijk de live feed op',
    },

    footer: {
      tagline: 'Wie volg je voor AI?',
      dataNote: 'Data uit NewsFlux.',
    },

    ui: {
      loadMore: 'Toon meer',
      noResults: 'Geen creators gevonden voor deze filter.',
      showingTemplate: '{shown} van {total} getoond',
    },

    aboutPath: '/over',
    organisatiesPath: '/organisaties',
  },

  en: {
    siteName: 'whotofollow',
    siteDescription: 'Who do you follow for AI? A curated directory of makers, researchers and companies across GitHub, YouTube, Twitter and Bluesky.',
    siteTagline: 'Who do you follow for AI?',

    nav: {
      everyone: 'Everyone',
      github: 'GitHub',
      youtube: 'YouTube',
      twitter: 'Twitter',
      bluesky: 'Bluesky',
      about: 'About',
      organisations: 'Organisations',
    },

    hero: {
      graph: 'Creator graph',
      updated: 'Updated',
      titleA: 'Who to follow',
      titleB: 'for AI?',
      sub: (total: number, cross: number) =>
        `${total} curated makers, researchers and companies across GitHub, YouTube, Twitter and Bluesky — ${cross} we've already linked across multiple platforms.`,
    },

    filters: {
      everyone: 'Everyone',
      cross: 'Multi-platform',
      picks: 'Editor\'s picks',
      categoryAll: 'All topics',
      categoryHeading: 'Topic',
    },

    detail: {
      back: 'Back to directory',
      openOn: 'Open on',
      platforms: 'Platforms',
      stats: 'Stats',
      location: 'Location',
      worksAt: 'Works at',
      organization: 'Organization',
    },

    category: {
      titlePrefix: 'AI creators in',
      hero: (cat: string, n: number) => `${n} makers, researchers and companies writing and building about ${cat.toLowerCase()} — curated and algorithmically selected.`,
      editorsHeading: 'Editor\'s picks',
      editorsEmpty: 'No hand-curated picks in this category yet.',
      othersHeading: 'All creators in this category',
      othersEmpty: 'No other creators in this category yet.',
      otherCategoriesHeading: 'Other topics',
      backToAll: '← All creators',
    },

    about: {
      title: 'About whotofollow',
      whoHeading: 'Who\'s listed',
      whoIntro: (n: number) =>
        `${n} makers, researchers and companies active around AI, pulled from four platforms:`,
      sourceGH: 'owners of trending AI repos, with bio + cross-platform link via twitter_username',
      sourceYT: 'channels with a meaningful audience, country and subscribers',
      sourceTW: 'verified accounts active about AI (filtered on activity, not celebrity volume)',
      sourceBSKY: 'early adopters and news outlets discussing AI',
      cross: (n: number, updated: string) => `${n} creators we\'ve linked across platforms. Last update: ${updated}.`,
      criteriaHeading: 'Selection criteria',
      criteriaBody: 'We list makers that are actively flagged as AI-relevant in our database, with at least 100 followers on their primary platform and measurable activity in the past 60 days. Twitter accounts must be Blue-verified to filter out follower-buying noise.',
      relatedHeading: 'Related sites',
      relatedBody: 'Want to see what they make? Check the live feed at',
    },

    footer: {
      tagline: 'Who do you follow for AI?',
      dataNote: 'Data from NewsFlux.',
    },

    ui: {
      loadMore: 'Show more',
      noResults: 'No creators found for this filter.',
      showingTemplate: '{shown} of {total} shown',
    },

    aboutPath: '/en/about',
    organisatiesPath: '/en/organisations',
  },
} as const;

export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}

export function getDateLocale(locale: Locale): string {
  return locale === 'en' ? 'en-US' : 'nl-NL';
}

export function pathWithoutLocale(pathname: string): string {
  const m = pathname.match(/^\/(en)(?=\/|$)(.*)$/);
  return m ? (m[2] || '/') : pathname;
}

export function localizedHref(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'nl') return clean;
  return `/en${clean === '/' ? '' : clean}`;
}

/**
 * Path mapping for routes whose slug differs per locale.
 */
const PATH_ALIASES: Record<string, { nl: string; en: string }> = {
  about: { nl: '/over', en: '/en/about' },
  organisations: { nl: '/organisaties', en: '/en/organisations' },
};

// Category pages use different slugs per locale (/onderwerp ↔ /en/topic).
// Resolve them dynamically in getAlternateUrl below.
const CATEGORY_ROOT = { nl: '/onderwerp', en: '/en/topic' };

function stripTrailingSlash(p: string): string {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

/**
 * De site serveert álle pagina's in de mét-trailing-slash-vorm (directory
 * build + Cloudflare 307 op de slashloze variant). Alternates/hreflang moeten
 * dus altijd op `/` eindigen, anders wijzen ze naar een redirect.
 */
function ensureTrailingSlash(p: string): string {
  return p.endsWith('/') ? p : `${p}/`;
}

/**
 * Return the URL for the same logical page in the other locale.
 * Always returns the trailing-slash (200) form.
 */
export function getAlternateUrl(currentPath: string, currentLocale: Locale): string {
  const target: Locale = currentLocale === 'nl' ? 'en' : 'nl';
  const cleaned = stripTrailingSlash(currentPath);

  for (const aliases of Object.values(PATH_ALIASES)) {
    if (cleaned === aliases[currentLocale]) return ensureTrailingSlash(aliases[target]);
  }

  // Category routes — /onderwerp/agents ↔ /en/topic/agents
  const catMatch = cleaned.match(/^(?:\/en)?\/(onderwerp|topic)\/([a-z0-9-]+)$/);
  if (catMatch) {
    const slug = catMatch[2];
    return ensureTrailingSlash(`${CATEGORY_ROOT[target]}/${slug}`);
  }

  const noLocale = pathWithoutLocale(cleaned);
  return ensureTrailingSlash(localizedHref(noLocale, target));
}

/** Build a localized category page URL: /onderwerp/X or /en/topic/X */
export function categoryHref(slug: string, locale: Locale): string {
  return `${CATEGORY_ROOT[locale]}/${slug}`;
}
