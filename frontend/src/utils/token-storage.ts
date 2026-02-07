/**
 * Utility functions for managing JWT tokens in browser storage
 */

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Stores the JWT token in localStorage
 */
export const storeToken = (token: string, refreshToken?: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Error storing token:', error);
    // Handle storage errors (e.g., storage quota exceeded)
    throw new Error('Failed to store authentication token');
  }
};

/**
 * Retrieves the JWT token from localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Retrieves the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Removes the JWT token from localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Checks if the token exists and is not expired
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    // Decode the token to check its expiration
    const payload = parseJwt(token);
    if (!payload.exp) {
      // If no expiration is set, assume the token is valid
      return true;
    }

    // Check if the token is expired (considering 1 minute buffer)
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 60; // 1 minute buffer
    return payload.exp > currentTime + bufferTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Parses a JWT token to extract its payload
 */
const parseJwt = (token: string): { exp?: number; [key: string]: any } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    throw new Error('Invalid JWT token format');
  }
};

/**
 * Gets the token expiration timestamp
 */
export const getTokenExpiration = (): number | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const payload = parseJwt(token);
    return payload.exp ? payload.exp * 1000 : null; // Convert seconds to milliseconds
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};