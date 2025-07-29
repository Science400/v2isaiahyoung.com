import fetch from '@11ty/eleventy-fetch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getWikipediaData(searchTerm) {
  // Skip empty search terms
  if (!searchTerm || searchTerm.trim() === '') {
    return null;
  }

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
  
  try {
    let data = await fetch(url, {
      duration: '1d',
      type: 'json'
    });
    
    return {
      title: data.title,
      extract: data.extract,
      thumbnail: data.thumbnail?.source,
      url: data.content_urls?.desktop?.page
    };
  } catch (error) {
    console.warn(`Failed to fetch Wikipedia data for "${searchTerm}":`, error.message);
    return null;
  }
}

// Helper function to handle arrays and strings
function normalizeToArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}

export default async function() {
  // Read the JSON file using fs/promises instead of import
  const jsonPath = join(__dirname, 'peterWolf.json');
  const jsonContent = await readFile(jsonPath, 'utf-8');
  const recordings = JSON.parse(jsonContent);
  
  const wikipediaData = [];
  
  for (const recording of recordings) {
    // Normalize arrays for narrator and orchestra
    const narrators = normalizeToArray(recording.narrator);
    const orchestras = normalizeToArray(recording.orchestra);
    
    // Fetch Wikipedia data for each narrator, orchestra, and conductor
    const narratorPromises = narrators.map(narrator => getWikipediaData(narrator));
    const narratorWikis = await Promise.all(narratorPromises);
    
    const orchestraPromises = orchestras.map(orchestra => getWikipediaData(orchestra));
    const orchestraWikis = await Promise.all(orchestraPromises);
    
    const conductorWiki = await getWikipediaData(recording.conductor);
    
    wikipediaData.push({
      ...recording,
      narratorWikis: narratorWikis.filter(wiki => wiki !== null),
      orchestraWikis: orchestraWikis.filter(wiki => wiki !== null),
      conductorWiki
    });
  }
  
  return wikipediaData;
}