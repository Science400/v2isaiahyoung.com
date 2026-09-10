---
title: Writing and publishing
description: How to add a post, a garden entry or a captain's log to this site, and how it gets published.
---

Notes to myself about running this site. Written 2026-09-09, after upgrading to
Eleventy Excellent 4.8.

## Making a new thing

Don't hand-write front matter — the scaffold gets the fiddly parts right:

```bash
npm run new -- post "Title of the post"
npm run new -- log
npm run new -- til "Something I learned"
```

Garden types are `til`, `essay`, `captainsLog`, `showAndTell` and `clipping`.
These have to match the dropdown options on `/garden/`, or the entry can't be
filtered there.

`npm run new -- log` makes a captain's log dated today, in its own folder so
images can sit next to it, using the LCARS layout.

Two things the scaffold handles that are easy to get wrong by hand:

- **`dateTended` is required.** The `gardenPosts` collection sorts on it, so an
  entry without one sorts unpredictably.
- **The date is local, not UTC.** Writing in the evening with a UTC date would
  stamp the entry tomorrow.

## Writing

Then just write markdown and run:

```bash
npm start
```

Live at `http://localhost:8080`, rebuilding as files are saved.

Add `draft: true` to front matter to keep something out of production builds
while still seeing it locally.

### Images

```
{% raw %}{% image "./src/assets/images/blog/thing.jpg", "Alt text", "Optional caption" %}{% endraw %}
```

Arguments in order: `src, alt, caption, loading, containerClass, imageClass,
widths, sizes, formats`. **This order changed in Eleventy Excellent 4.x** — it
used to be `className, sizes, widths` at positions 5–7. If an old snippet looks
wrong, that's why.

Plain markdown images work too and get optimised automatically:

```markdown
![Alt text](/assets/images/blog/thing.jpg 'Optional caption')
```

Remote images get downloaded and self-hosted at build time.

### Checking accessibility

```bash
npm run test:a11y
```

Runs the pages listed in `meta.tests.pa11y.customPaths` against WCAG 2 AA. It
has already caught real problems — unlabelled `<select>` filters on the garden
page. Add new page types to that list as the site grows.

## Publishing

Push to `main`. Cloudflare Pages builds and deploys automatically.

```bash
git add . && git commit -m "Add a post" && git push
```

Every push also runs the **Build** GitHub Action, which catches broken builds in
about a minute rather than after a failed deploy.

## Things that have bitten me

Worth remembering, because each cost real time:

- **Cloudflare ignores `netlify.toml` entirely.** Host config lives in
  `src/common/_headers.njk` and `_redirects.njk`, which are emitted into the
  build output. Editing `netlify.toml` would do nothing — it's deleted now.
- **The Cloudflare build command is `npx @11ty/eleventy`,** set in the dashboard,
  not `npm run build`. So `ELEVENTY_ENV` is never set there. Anything that needs
  to know it's a production build must use `src/_config/utils/is-production.js`,
  which also checks `CF_PAGES`. Getting this wrong silently published
  `http://localhost:8080` as the canonical URL for months.
- **Never let a remote fetch fail the build.** `github.js` had no error handling
  and a GitHub API rate limit took down a production deploy. Data files that
  fetch anything should catch and return something empty — see `github.js` and
  `peterWolfWikipedia.js`.
- **`www.isaiahyoung.com` doesn't resolve** (522). Only the apex works. Worth
  fixing in Cloudflare DNS sometime.

## Where things live

| What | Where |
|---|---|
| Blog posts | `src/posts/<year>/` |
| Garden entries | `src/garden/` |
| Pressed pennies | `src/museum/coins/` |
| Site identity, nav, feeds | `src/_data/meta.js` |
| Global styles | `src/assets/css/global/` |
| Page-specific CSS (inlined) | `src/assets/css/local/` |
| Linked stylesheets | `src/assets/css/components/` |
| Eleventy config | `eleventy.config.js`, `src/_config/` |
