import fetch from '@11ty/eleventy-fetch';

async function getWikipediaData(searchTerm) {
  if (!searchTerm) return null;
  
  try {
    const cleanedTerm = searchTerm.replace(/"/g, ''); // Remove quotes
    const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanedTerm)}`;
    
    const summary = await fetch(wikipediaUrl, {
      duration: '1d', // Cache for 1 day
      type: 'json'
    });
    
    return {
      extract_html: summary.extract_html || '',
      thumbnail: summary.thumbnail || null,
      content_urls: summary.content_urls || null
    };
  } catch (error) {
    console.warn(`Could not fetch Wikipedia data for ${searchTerm}:`, error.message);
    return {
      extract_html: '',
      thumbnail: null,
      content_urls: null
    };
  }
}

export default async function() {
  const peterWolfData = await import('./peterWolf.json', { with: { type: 'json' } });
  const recordings = peterWolfData.default;
  
  const wikipediaData = [];
  
  for (const recording of recordings) {
    // Fetch Wikipedia data for narrator, orchestra, and conductor
    const [narratorWiki, orchestraWiki, conductorWiki] = await Promise.all([
      getWikipediaData(recording.narrator),
      getWikipediaData(recording.orchestra),
      getWikipediaData(recording.conductor)
    ]);
    
    wikipediaData.push({
      ...recording,
      narratorWikipedia: narratorWiki,
      orchestraWikipedia: orchestraWiki,
      conductorWikipedia: conductorWiki
    });
  }
  
  return wikipediaData;
}