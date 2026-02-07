import { getToken, isTokenValid, removeToken } from '../utils/token-storage';
import { handleApiError, isAuthenticationError } from '../utils/error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Main API client for making HTTP requests to the backend
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Makes a GET request to the specified endpoint
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * Makes a POST request to the specified endpoint
   */
  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  /**
   * Makes a PUT request to the specified endpoint
   */
  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  /**
   * Makes a DELETE request to the specified endpoint
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Generic request method that handles authentication and error handling
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Prepare headers
    let headers: HeadersInit = {
      ...(options.headers || {}),
    };

    // Add authorization header if the request requires authentication
    if (options.requiresAuth !== false) {
      const token = getToken();
      if (token && isTokenValid()) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (options.requiresAuth === true) {
        // If auth is explicitly required but token is not valid, reject the request
        throw new Error('Authentication required but no valid token available');
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
      ...options,
    };

    // Add body for methods that support it
    if (data !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
      if (headers['Content-Type'] === 'application/json') {
        requestOptions.body = JSON.stringify(data);
      } else {
        requestOptions.body = data;
      }
    }

    try {
      const response = await fetch(url, requestOptions);

      // Handle authentication errors specifically
      if (isAuthenticationError({ status: response.status })) {
        // Remove invalid token from storage
        removeToken();

        // Optionally redirect to login page or trigger auth flow
        // This would typically be handled by the calling component
      }

      // Try to parse response as JSON
      let responseData: T | string | null = null;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        if (response.status !== 204) { // No content
          responseData = await response.json() as T;
        }
      } else {
        responseData = await response.text() as unknown as T;
      }

      // Throw error for non-success status codes
      if (!response.ok) {
        const error = handleApiError({
          status: response.status,
          message: response.statusText,
          data: responseData,
        });
        throw error;
      }

      return responseData as T;
    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        throw handleApiError({
          status: 0,
          message: 'Network Error',
          data: null,
        });
      }

      // Re-throw if it's already an ApiError
      if ((error as any).status) {
        throw error;
      }

      // Handle other errors
      throw handleApiError({
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      });
    }
  }

  /**
   * Sets a new base URL for the API client
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }
}

// Create a singleton instance of the API client
const apiClient = new ApiClient();

export default apiClient;

// Export the class for cases where you need multiple instances with different configs
export { ApiClient };