import axios from 'axios';

/**
 * Fetches data from a URL with robust fallback to CORS proxies.
 * Useful for APIs that don't support HTTPS (like Weatherstack Free) when running on HTTPS.
 * 
 * @param {string} url - The target URL to fetch (e.g., http://api.weatherstack.com/...)
 * @param {object} config - Axios config object (headers, params, etc.)
 * @returns {Promise<any>} - The response data
 */
export const fetchWithFallback = async (url, config = {}) => {
    // 1. Try Direct Request first
    // This works on localhost (http) or if the API supports https
    try {
        const response = await axios.get(url, config);
        // Weatherstack specifically returns success: false with an error object sometimes, simpler to check here?
        // Actually weatherstack returns 200 OK even for errors, so we pass it through.
        return response.data;
    } catch (error) {
        console.warn('Direct fetch failed, attempting proxies...', error.message);

        // Only retry for Network Errors (Mixed Content) or specific CORS issues
        const isNetworkError = error.message === 'Network Error';
        if (!isNetworkError) {
            throw error; // If it's a 404 or 500 from the server, don't retry via proxy
        }
    }

    // Construct full URL with params for proxies
    const urlObj = new URL(url);
    if (config.params) {
        Object.keys(config.params).forEach(key =>
            urlObj.searchParams.append(key, config.params[key])
        );
    }
    const fullUrl = urlObj.toString();
    const encodedUrl = encodeURIComponent(fullUrl);

    // 2. Try CodeTabs Proxy
    try {
        console.log('Attempting CodeTabs proxy...');
        const response = await axios.get(`https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`);
        return response.data;
    } catch (error) {
        console.warn('CodeTabs proxy failed', error.message);
    }

    // 3. Try AllOrigins Proxy (Restricted to fewer headers but good fallback)
    try {
        console.log('Attempting AllOrigins proxy...');
        const response = await axios.get(`https://api.allorigins.win/get?url=${encodedUrl}`);
        if (response.data && response.data.contents) {
            // AllOrigins returns the data as a string in 'contents', need to parse if JSON
            try {
                return JSON.parse(response.data.contents);
            } catch (e) {
                return response.data.contents;
            }
        }
    } catch (error) {
        console.warn('AllOrigins proxy failed', error.message);
    }

    throw new Error('All fetch attempts failed. Please disable HTTPS or use a paid API plan.');
};
