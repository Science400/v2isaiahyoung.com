import {isProductionBuild} from '../_config/utils/is-production.js';

// Canonical production origin. Used for canonical tags, og:url, sitemap.xml,
// the RSS/JSON feeds and llms.txt — so it must be the real domain in production.
// NOTE: `process.env.URL` is a Netlify variable and is NOT set by Cloudflare
// Pages. Cloudflare's own CF_PAGES_URL is the per-deployment *.pages.dev
// address, not the custom domain, so it is deliberately not used here.
const productionUrl = 'https://isaiahyoung.com';

export const url = process.env.URL || (isProductionBuild ? productionUrl : 'http://localhost:8080');
export const siteName = 'Isaiah\'s Notes';
export const siteDescription = 'My little corner of the web.';
export const siteType = 'Person'; // schema
export const locale = 'en_EN';
export const lang = 'en';
export const skipContent = 'Skip to content';
export const author = {
  name: 'Isaiah Young',
  avatar: '/icon-512x512.png', // path to the author's avatar. In this case just using a favicon.
  email: 'science400@gmail.com',
  website: 'https://isaiahyoung.com', // apex only; the www host does not resolve
  fediverse: 'https://mstdn.plus/@science400' // used for highlighting journalism on the fediverse. Can be Mastodon, Flipboard, Threads, WordPress (with the ActivityPub plugin installed), PeerTube, Pixelfed, etc. https://blog.joinmastodon.org/2024/07/highlighting-journalism-on-mastodon/
};
export const creator = {
  name: 'Isaiah Young',
  email: 'science400@gmail.com',
  website: 'https://isaiahyoung.com',
  social: 'https://mstdn.plus/@science400'
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#DD4462'; //  Manifest: defines the default theme color for the application
export const themeBgColor = '#FBFBFB'; // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  "Isaiah's Notes: a personal website of blog posts, a digital garden, a pressed penny museum and assorted experiments."; // alt text for the default meta image
export const blog = {
  // RSS feed
  name: 'Isaiah\'s Notes',
  description: 'Who wants to hear what I like? Who wouldn\'t?',
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  // Tags
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'More tags:',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Page',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  paginationNumbers: true
};
export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  drawerNav: false
};
export const themeSwitch = {
  title: 'Theme',
  light: 'daytime',
  dark: 'nighttime'
};
export const greenweb = {
  // this goes into src/common/greenweb.njk
  providers: {
    // if you want to add more than one, edit the array directly.
    domain: 'cloudflare.com',
    service: 'cdn'
  },
  credentials: {
    // optional, eg: 	{ domain='my-org.com', doctype = 'webpage', url = 'https://my-org.com/our-climate-record'}
    domain: '',
    doctype: '',
    url: ''
  }
};
export const robots = {
  // AI bot user agents live in `src/common/robots.njk` (sourced from
  // https://github.com/ai-robots-txt/ai.robots.txt).
  // Training / AI-search scrapers
  allowAiCrawlers: false,
  // On-demand assistants and browsing agents.
  allowAiAgents: false,
  // emit /llms.txt at build time.
  generateLlmsTxt: true
};
export const tests = {
  pa11y: {
    // keep customPaths empty if you want to test all pages
    customPaths: [
      '/',
      '/blog/',
      '/garden/',
      '/garden/2025-12-28/', // LCARS layout
      '/museum/',
      '/88x31/',
      '/peter-wolf/'
    ],
    globalIgnore: []
  }
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: true,
  infoText: 'View this page on GitHub'
};
export const easteregg = true;
