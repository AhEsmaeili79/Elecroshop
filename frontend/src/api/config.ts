/**
 * API Configuration
 * Base URL is dynamically set from environment variables or defaults to the schema endpoint
 * 
 * Priority order:
 * 1. BACKEND_API_BASE_URL environment variable (recommended)
 * 2. Runtime window.__API_BASE_URL__ (for dynamic configuration)
 * 3. Default fallback to http://web.com
 * 
 * Usage:
 * - Development: Set BACKEND_API_BASE_URL in .env.local
 * - Production: Set BACKEND_API_BASE_URL in your deployment environment
 * - Runtime: Set window.__API_BASE_URL__ before API calls (for dynamic config)
 */

export const getApiBaseUrl = (): string => {
  // 1. Check for runtime configuration (client-side only)
  if (typeof window !== 'undefined') {
    const runtimeBaseUrl = (window as any).__API_BASE_URL__;
    if (runtimeBaseUrl && typeof runtimeBaseUrl === 'string') {
      return runtimeBaseUrl.trim();
    }
  }

  // 2. Check for environment variable (works on both server and client)
  const envBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (envBaseUrl && typeof envBaseUrl === 'string') {
    return envBaseUrl.trim();
  }

  // 3. Default fallback (your current backend URL)
  return '';
};

/**
 * Get the API base URL
 * This is computed once when the module loads
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * Get the API base URL dynamically (recomputes on each call)
 * Use this if you need to get the latest value after runtime changes
 */
export const getDynamicApiBaseUrl = (): string => {
  return getApiBaseUrl();
};

