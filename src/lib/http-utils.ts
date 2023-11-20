/**
 * Wrapper so that fetch requests are wrapped in a try catch block.
 * @param url The endpoint to fetch.
 * @param params The Request parameters (method, headers, body, etc).
 * @returns The response, or an error.
 */
export const fetchWithErrorHandling = async (
  url: string,
  params: RequestInit
): Promise<Response | string> => {
  try {
    return fetch(url, params);
  } catch (error) {
    return 'Error fetching data.' + error;
  }
};
