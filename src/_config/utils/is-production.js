/**
 * Is this a real deployed build, as opposed to local development?
 *
 * Two independent signals, because relying on either alone has bitten us:
 *
 * - ELEVENTY_ENV is set by the npm scripts (`cross-env ELEVENTY_ENV=production`).
 *   It is only present if the host actually runs `npm run build`. Cloudflare
 *   Pages takes its build command from the dashboard, not from this repo, so a
 *   command like `npx eleventy` produces a build where ELEVENTY_ENV is unset —
 *   silently disabling HTML minification and publishing localhost URLs.
 *
 * - CF_PAGES is set to "1" by Cloudflare Pages in every build, preview and
 *   production alike, regardless of the configured build command.
 *
 * Treating preview deploys as production is intentional: previews should carry
 * the canonical production origin rather than advertise a *.pages.dev URL.
 */
export const isProductionBuild =
  process.env.CF_PAGES === '1' || process.env.ELEVENTY_ENV === 'production';
