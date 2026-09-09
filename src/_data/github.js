import EleventyFetch from '@11ty/eleventy-fetch';

/**
 * Public repositories, used by the "post with fetched content" demo.
 *
 * The unauthenticated GitHub API allows 60 requests per hour per IP, and CI
 * build machines share IPs, so this call gets 403 rate-limited unpredictably.
 * Without a catch, a single 403 aborts the whole Eleventy build and fails the
 * deploy -- which is exactly what happened on 2026-09-09.
 *
 * A demo listing is not worth taking the site down for, so failures degrade to
 * an empty list. Templates already guard on stargazer count, so they render
 * nothing rather than breaking.
 */
export default async function () {
  const url = 'https://api.github.com/users/science400/repos';

  try {
    return await EleventyFetch(url, {
      duration: '1d',
      type: 'json'
    });
  } catch (error) {
    console.warn(`Could not fetch GitHub repositories: ${error.message}`);
    return [];
  }
}
