import fetch from '@11ty/eleventy-fetch';

async function getWikipediaData(searchTerm) {
  if (!searchTerm) return null;
  
  try {
    const cleanedTerm = searchTerm.replace(/"/g, ''); // Remove quotes
    const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanedTerm)}`;
    
    const summary = await fetch(wikipediaUrl, {
      duration: '4w', // Cache for 1 month
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

// Helper function to handle arrays and strings
function normalizeToArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

export default async function() {
  const peterWolfData = await import('./peterWolf.json', { with: { type: 'json' } });
  const recordings = peterWolfData.default;
  
  const wikipediaData = [];
  
  for (const recording of recordings) {
    // Normalize arrays for narrator
    const narrators = normalizeToArray(recording.narrator);
    
    // Fetch Wikipedia data for each narrator, orchestra, and conductor
    const narratorPromises = narrators.map(narrator => getWikipediaData(narrator));
    const narratorWikis = await Promise.all(narratorPromises);
    
    const [orchestraWiki, conductorWiki] = await Promise.all([
      getWikipediaData(recording.orchestra),
      getWikipediaData(recording.conductor)
    ]);
    
    wikipediaData.push({
      ...recording,
      narratorWikipedia: narratorWikis, // Array of Wikipedia data for each narrator
      orchestraWikipedia: orchestraWiki,
      conductorWikipedia: conductorWiki
    });
  }
  
  return wikipediaData;
}