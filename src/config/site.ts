export const siteConfig = {
  name: 'whotofollow',
  url: 'https://whotofollow.online',
  description: 'Wie volg je voor AI? Een gecureerde directory van makers, onderzoekers en bedrijven over GitHub, YouTube, Twitter en Bluesky.',
  tagline: 'Wie volg je voor AI?',
  twitter: '@whotofollow',
  defaultOg: '/og-image.png',
  navigation: [
    { label: 'Iedereen', href: '/' },
    { label: 'GitHub', href: '/?platform=github' },
    { label: 'YouTube', href: '/?platform=youtube' },
    { label: 'Twitter', href: '/?platform=twitter' },
    { label: 'Bluesky', href: '/?platform=bluesky' },
    { label: 'Over', href: '/over' },
  ],
  footerLinks: [
    { label: 'RSS', href: '/rss.xml' },
    { label: 'Feedzzz', href: 'https://feedzzz.online' },
    { label: 'Debesteaitools', href: 'https://debesteaitools.nl' },
  ],
} as const;
