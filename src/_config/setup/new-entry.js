#!/usr/bin/env node
/**
 * Scaffolds a new post or garden entry with correct front matter.
 *
 *   npm run new -- post "Title of the thing"
 *   npm run new -- log            (captain's log, dated today, LCARS layout)
 *   npm run new -- til "Title"    (also: essay, clipping, showAndTell)
 *
 * Exists because the front matter is easy to get subtly wrong by hand:
 * garden entries need a permalink, a gardenType matching the filter options
 * on /garden/, and a dateTended (the gardenPosts collection sorts on it, so
 * an entry without one sorts unpredictably).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

// Must match the <option> values in src/garden/garden.njk, or the entry
// cannot be filtered on the garden index.
const GARDEN_TYPES = ['til', 'essay', 'captainsLog', 'showAndTell', 'clipping'];
const ALIASES = {log: 'captainsLog', clip: 'clipping', showandtell: 'showAndTell'};

// Local date, not toISOString(): that returns UTC, so writing in the evening
// from a timezone behind UTC would date the entry tomorrow.
const today = () => {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const slugify = str =>
  str
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const usage = () => {
  console.error(`
Usage:
  npm run new -- post "Title"          a blog post in src/posts/<year>/
  npm run new -- log                   a captain's log, dated today (LCARS layout)
  npm run new -- <type> "Title"        a garden entry

Garden types: ${GARDEN_TYPES.join(', ')}
`);
  process.exit(1);
};

const write = async (file, body) => {
  await fs.mkdir(path.dirname(file), {recursive: true});
  try {
    await fs.writeFile(file, body, {flag: 'wx'});
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.error(`Refusing to overwrite existing file:\n  ${file}`);
      process.exit(1);
    }
    throw error;
  }
  console.log(`Created ${file}`);
};

const [rawKind, ...titleParts] = process.argv.slice(2);
if (!rawKind) usage();

const kind = ALIASES[rawKind.toLowerCase()] ?? rawKind;
const date = today();

if (kind === 'post') {
  const title = titleParts.join(' ').trim();
  if (!title) usage();
  const file = `src/posts/${date.slice(0, 4)}/${date}-${slugify(title)}.md`;
  await write(
    file,
    `---
title: '${title.replace(/'/g, "''")}'
description: ''
date: ${date}
layout: post
# tags: ['']
# draft: true       # hidden from production builds until removed
# image: './src/assets/images/blog/example.jpg'
# alt: 'Describe the image for screen readers'
---

`
  );
} else if (kind === 'captainsLog') {
  // Logs are titled by date and live in their own folder so images can sit beside them.
  const file = `src/garden/captainsLog${date}/captainsLog${date}.md`;
  await write(
    file,
    `---
title: '${date}'
permalink: /garden/{{ title | slugify }}/index.html
description: "Captain's Log - ${date}"
layout: lcars
gardenType: captainsLog
gardenStatus: evergreen
datePlanted: ${date}
dateTended: ${date}
---

`
  );
} else if (GARDEN_TYPES.includes(kind)) {
  const title = titleParts.join(' ').trim();
  if (!title) usage();
  const file = `src/garden/${slugify(title)}.md`;
  await write(
    file,
    `---
title: '${title.replace(/'/g, "''")}'
permalink: /garden/{{ title | slugify }}/index.html
description: ''
layout: page
gardenType: ${kind}
gardenStatus: seedling
datePlanted: ${date}
dateTended: ${date}
---

`
  );
} else {
  console.error(`Unknown type: ${rawKind}`);
  usage();
}
