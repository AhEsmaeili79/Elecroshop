/**
 * JWT Token Storage Utility
 * Handles secure storage and retrieval of JWT tokens
 */

const ACCESS_TOKEN_KEY = 'access_t';
const REFRESH_TOKEN_KEY = 'refresh_t';
const USER_KEY = 'auth_user';

export interface StoredTokens {
  access: string;
  refresh: string;
}

/**
 * Store access token
 */
export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }
};

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }
  return null;
};

/**
 * Store refresh token
 */
export const setRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }
  return null;
};

/**
 * Store tokens
 */
export const setTokens = (tokens: StoredTokens): void => {
  setAccessToken(tokens.access);
  setRefreshToken(tokens.refresh);
};

/**
 * Get tokens
 */
export const getTokens = (): StoredTokens | null => {
  const access = getAccessToken();
  const refresh = getRefreshToken();
  
  if (access && refresh) {
    return { access, refresh };
  }
  return null;
};

/**
 * Clear all tokens
 */
export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
};

/**
 * Store user data
 */
export const setUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  }
};

/**
 * Get user data
 */
export const getUser = (): any | null => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
