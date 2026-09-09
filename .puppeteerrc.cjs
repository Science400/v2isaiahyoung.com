/**
 * Puppeteer arrives as a transitive dependency of pa11y-ci, which powers
 * `npm run test:a11y`. That is a local-only tool: the Cloudflare Pages build
 * only ever runs `eleventy`, and never needs a browser.
 *
 * Left alone, puppeteer's postinstall downloads ~280MB of Chrome on every
 * deploy. If that download or its extraction fails, `npm install` exits
 * non-zero and takes the whole deploy down with it.
 *
 * Cloudflare Pages sets CF_PAGES=1 in the build environment, so skip the
 * download there and keep it for local development.
 * https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
 */
module.exports = {
  skipDownload: Boolean(process.env.CF_PAGES)
};
