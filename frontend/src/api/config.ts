/**
 * API Configuration
 * Base URL is dynamically set from environment variables or defaults to the schema endpoint
 */

export const getApiBaseUrl = (): string => {
  // Check for environment variable first
  if (typeof window !== 'undefined') {
    // Client-side: check for runtime config
    const runtimeBaseUrl = (window as any).__API_BASE_URL__;
    if (runtimeBaseUrl) {
      return runtimeBaseUrl;
    }
  }

  // Server-side or fallback: use environment variable
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // Default fallback
  return 'http://95.216.121.250:8006';
};

export const API_BASE_URL = getApiBaseUrl();

