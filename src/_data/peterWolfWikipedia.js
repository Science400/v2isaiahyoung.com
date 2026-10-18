import fetch from '@11ty/eleventy-fetch';
import {isProductionBuild} from '../_config/utils/is-production.js';

// Wikimedia asks API clients to identify themselves, and rate limits
// anonymous ones harder: https://meta.wikimedia.org/wiki/User-Agent_policy
const USER_AGENT = 'isaiahyoung.com-build/1.0 (https://isaiahyoung.com)';
const MAX_ATTEMPTS = 4;

// Names whose plain Wikipedia title is a different article.
const WIKIPEDIA_TITLES = {
  'Manfred Mann': 'Manfred Mann (musician)' // plain title is his band
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// The same orchestras and conductors appear on many recordings; look each up once.
const lookups = new Map();

function getWikipediaData(searchTerm) {
  if (!searchTerm) return null;

  // Skip network requests in development to speed up builds
  if (!isProductionBuild) {
    return null;
  }

  if (!lookups.has(searchTerm)) {
    lookups.set(searchTerm, fetchWikipediaData(WIKIPEDIA_TITLES[searchTerm] || searchTerm));
  }
  return lookups.get(searchTerm);
}

// A 429 used to drop every summary after the first few dozen recordings,
// so wait and try again rather than giving up on the first one.
async function fetchSummary(wikipediaUrl) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(wikipediaUrl, {
        duration: '4w', // Cache for 1 month
        type: 'json',
        fetchOptions: {headers: {'User-Agent': USER_AGENT}}
      });
    } catch (error) {
      const response = error.cause;
      if (response?.status !== 429 || attempt === MAX_ATTEMPTS) throw error;
      const retryAfter = Number(response.headers?.get('retry-after'));
      await sleep(retryAfter > 0 ? Math.min(retryAfter, 30) * 1000 : 2000 * attempt);
    }
  }
}

async function fetchWikipediaData(searchTerm) {
  try {
    const cleanedTerm = searchTerm.replace(/"/g, ''); // Remove quotes
    const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanedTerm)}`;

    const summary = await fetchSummary(wikipediaUrl);

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

    // Individual players, for recordings made by a band rather than an orchestra
    const musicianWikis = await Promise.all(
      normalizeToArray(recording.musicians).map(musician => getWikipediaData(musician))
    );
    
    wikipediaData.push({
      ...recording,
      narratorWikipedia: narratorWikis, // Array of Wikipedia data for each narrator
      orchestraWikipedia: orchestraWiki,
      conductorWikipedia: conductorWiki,
      musiciansWikipedia: musicianWikis
    });
  }
  
  return wikipediaData;
}