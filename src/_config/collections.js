/** All blog posts as a collection. */
export const getAllPosts = collection => {
  return collection.getFilteredByGlob('./src/posts/**/*.md').reverse();
};

/** All markdown files as a collection for sitemap.xml */
export const onlyMarkdown = collection => {
  return collection.getFilteredByGlob('./src/**/*.{md,njk}');
};

/** All tags from all posts as a collection - excluding custom collections */
export const tagList = collection => {
  const tagsSet = new Set();
  collection.getAll().forEach(item => {
    if (!item.data.tags) return;
    item.data.tags.filter(tag => !['posts', 'docs', 'all'].includes(tag)).forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

/** Pressed pennies collection */
export const getPressedPennies = collection => {
  const pennySet = new Set();
  collection.getFilteredByGlob('./src/museum/coins/*.md').forEach(item => {
    if (!item.data.tags) return;
    item.data.tags.filter(tag => tag === 'pressedPenny').forEach(tag => pennySet.add(item));
  });
  return Array.from(pennySet);
  // return collection.getFilteredByGlob('./src/museum/coins/*.md');
}

/** All garden posts as a collection. */
export const getAllGardenPosts = collection => {
  return collection.getFilteredByGlob('./src/garden/**/*.md');
};

/** All Captain's Logs as a collection. */
export const getCaptainsLogs = collection => {
  const captainsLogs = new Set();
  collection.getFilteredByGlob('./src/garden/**/*.md').forEach(item => {
    if (item.data.gardenType === 'captainsLog') {
      captainsLogs.add(item);
    }
  })
  return Array.from(captainsLogs);
};