/**
 * HTTP Interceptors for handling authentication and other cross-cutting concerns
 */

import { getToken, isTokenValid, removeToken } from '../utils/token-storage';
import { handleApiError, isAuthenticationError } from '../utils/error-handler';

// Define types for interceptor callbacks
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: Response, config?: RequestConfig) => Response | Promise<Response>;
export type ErrorResponseInterceptor = (error: any, config?: RequestConfig) => Promise<any>;

// Request configuration interface
export interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  requiresAuth?: boolean;
  [key: string]: any;
}

// Response interface
export interface ResponseObject {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}

// Array to hold interceptor functions
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorResponseInterceptors: ErrorResponseInterceptor[] = [];

/**
 * Adds a request interceptor
 */
export const addRequestInterceptor = (interceptor: RequestInterceptor): number => {
  return requestInterceptors.push(interceptor) - 1;
};

/**
 * Adds a response interceptor
 */
export const addResponseInterceptor = (interceptor: ResponseInterceptor): number => {
  return responseInterceptors.push(interceptor) - 1;
};

/**
 * Adds an error response interceptor
 */
export const addErrorResponseInterceptor = (interceptor: ErrorResponseInterceptor): number => {
  return errorResponseInterceptors.push(interceptor) - 1;
};

/**
 * Applies all registered request interceptors to a request config
 */
export const applyRequestInterceptors = async (config: RequestConfig): Promise<RequestConfig> => {
  let modifiedConfig = { ...config };

  for (const interceptor of requestInterceptors) {
    try {
      modifiedConfig = await interceptor(modifiedConfig);
    } catch (error) {
      console.error('Error in request interceptor:', error);
      throw error;
    }
  }

  return modifiedConfig;
};

/**
 * Applies all registered response interceptors to a response
 */
export const applyResponseInterceptors = async (
  response: Response,
  config?: RequestConfig
): Promise<Response> => {
  let modifiedResponse = response.clone();

  for (const interceptor of responseInterceptors) {
    try {
      modifiedResponse = await interceptor(modifiedResponse, config);
    } catch (error) {
      console.error('Error in response interceptor:', error);
      throw error;
    }
  }

  return modifiedResponse;
};

/**
 * Applies all registered error response interceptors to an error
 */
export const applyErrorResponseInterceptors = async (
  error: any,
  config?: RequestConfig
): Promise<any> => {
  let modifiedError = error;

  for (const interceptor of errorResponseInterceptors) {
    try {
      modifiedError = await interceptor(modifiedError, config);
    } catch (err) {
      console.error('Error in error response interceptor:', err);
      throw err;
    }
  }

  return modifiedError;
};

/**
 * Authentication interceptor that adds JWT token to requests that require authentication
 */
export const authRequestInterceptor: RequestInterceptor = async (config: RequestConfig): Promise<RequestConfig> => {
  // Check if authentication is required for this request
  if (config.requiresAuth !== false) {
    const token = getToken();

    if (token && isTokenValid()) {
      // Add authorization header with JWT token
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else if (config.requiresAuth === true) {
      // If auth is explicitly required but token is not valid, throw an error
      throw new Error('Authentication required but no valid token available');
    }
  }

  return config;
};

/**
 * Authentication response interceptor that handles authentication errors
 */
export const authResponseInterceptor: ResponseInterceptor = async (
  response: Response,
  config?: RequestConfig
): Promise<Response> => {
  // Check if the response is an authentication error
  if (isAuthenticationError({ status: response.status })) {
    // Remove invalid token from storage
    removeToken();

    // Log the auth error for debugging
    console.warn(`Authentication error (${response.status}) for ${config?.url}`);

    // Optionally, trigger an auth state update here
    // This would involve calling some global auth state management
  }

  return response;
};

/**
 * Authentication error response interceptor that handles authentication errors
 */
export const authErrorResponseInterceptor: ErrorResponseInterceptor = async (error: any, config?: RequestConfig): Promise<any> => {
  // Check if the error is an authentication error
  if (error.response && isAuthenticationError(error.response)) {
    // Remove invalid token from storage
    removeToken();

    // Log the auth error for debugging
    console.warn(`Authentication error (${error.response.status}) for ${config?.url}`);

    // Optionally, trigger an auth state update here
    // This would involve calling some global auth state management
  }

  // Re-throw the error to be handled by the calling function
  throw error;
};

// Register the default authentication interceptors
addRequestInterceptor(authRequestInterceptor);
addResponseInterceptor(authResponseInterceptor);
addErrorResponseInterceptor(authErrorResponseInterceptor);

/**
 * Example usage:
 *
 * // To manually apply interceptors to a fetch request:
 * const makeAuthenticatedRequest = async (url: string, options: RequestConfig) => {
 *   // Apply request interceptors
 *   const processedOptions = await applyRequestInterceptors(options);
 *
 *   try {
 *     const response = await fetch(url, {
 *       method: processedOptions.method,
 *       headers: processedOptions.headers,
 *       body: processedOptions.body,
 *     });
 *
 *     // Apply response interceptors
 *     const processedResponse = await applyResponseInterceptors(response, processedOptions);
 *
 *     return processedResponse;
 *   } catch (error) {
 *     // Apply error response interceptors
 *     const processedError = await applyErrorResponseInterceptors(error, processedOptions);
 *     return processedError;
 *   }
 * };
 */