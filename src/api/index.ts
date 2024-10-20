import { endpoints } from "@/utils";

const apiCache = new Map();

/**
 * Makes an API call to the specified endpoint and caches the response.
 * The cache key includes both the endpoint and the coin id with query parameters.
 *
 * @param {string} endpointKey - The key to retrieve the API endpoint from the endpoints Map.
 * @param {object} [params={}] - Optional query parameters (e.g., {vs_currency: "usd"}).
 * @param {boolean} [forceRefresh=false] - If true, bypass the cache and make a new API request.
 * @param {string} [id] - Optional coin id to replace {id} in the endpoint URL.
 * @returns {Promise<any>} - The response data from the API.
 */
export const makeApiCall = async (
  endpointKey: string,
  params: Record<string, any> = {},
  forceRefresh = false,
  id?: string
) => {
  // Construct a unique cache key based on endpointKey, id, and query params
  let endpointUrl = endpoints.get(endpointKey);
  if (!endpointUrl) {
    throw new Error(`Endpoint not found for key: ${endpointKey}`);
  }

  // Replace {id} with actual coin id in the endpoint URL, if provided
  if (id) {
    endpointUrl = endpointUrl.replace("{id}", id);
  }

  // Append query parameters
  let queryParamsString = "";
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams(params).toString();
    endpointUrl += `?${queryParams}`;
    queryParamsString = `?${queryParams}`; // Save query params for cache key
  }

  // Create a unique cache key combining endpointUrl and query parameters
  const cacheKey = `${endpointUrl}${queryParamsString}`;

  // Check cache for the combined key
  const cachedResponse = apiCache.get(cacheKey);

  if (cachedResponse && !forceRefresh) {
    console.log(`Returning cached response for: ${cacheKey}`);
    return cachedResponse;
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-api-key": import.meta.env.VITE_APP_API_KEY,
    },
  };

  try {
    const response = await fetch(endpointUrl, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpointUrl}`);
    }

    const data = await response.json();

    // Cache the response based on the unique cacheKey
    apiCache.set(cacheKey, data);
    console.log(`Caching response for: ${cacheKey}`);

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${cacheKey}:`, error);
    throw error;
  }
};
