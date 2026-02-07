/**
 * Utility functions for handling different types of errors in the application
 */

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Handles API errors based on HTTP status codes
 */
export const handleApiError = (error: any): ApiError => {
  const apiError: ApiError = {
    name: error.name || 'ApiError',
    message: error.message || 'An unknown error occurred',
    status: error.status || 500,
    data: error.data || null,
  };

  // Handle specific status codes
  switch (error.status) {
    case 400:
      apiError.message = 'Bad Request: The request was invalid.';
      break;
    case 401:
      apiError.message = 'Unauthorized: Please log in to continue.';
      break;
    case 403:
      apiError.message = 'Forbidden: You do not have permission to access this resource.';
      break;
    case 404:
      apiError.message = 'Not Found: The requested resource was not found.';
      break;
    case 422:
      apiError.message = 'Unprocessable Entity: The request data was invalid.';
      break;
    case 500:
      apiError.message = 'Internal Server Error: Something went wrong on our end.';
      break;
    case 502:
      apiError.message = 'Bad Gateway: The server is temporarily unavailable.';
      break;
    case 503:
      apiError.message = 'Service Unavailable: The server is currently unable to handle the request.';
      break;
    default:
      if (error.message.includes('Network Error')) {
        apiError.message = 'Network Error: Unable to reach the server. Please check your connection.';
      } else if (typeof error.message === 'string' && error.message.includes('timeout')) {
        apiError.message = 'Timeout Error: The request took too long to complete.';
      }
      break;
  }

  return apiError;
};

/**
 * Displays user-friendly error messages based on error types
 */
export const getUserFriendlyMessage = (error: ApiError): string => {
  // For validation errors or client-side errors
  if (error.status >= 400 && error.status < 500) {
    return error.message;
  }

  // For server-side errors
  if (error.status >= 500) {
    return 'We\'re experiencing technical difficulties. Please try again later.';
  }

  // For network errors
  if (error.message.includes('Network Error') || error.message.includes('timeout')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Checks if the error indicates an authentication issue
 */
export const isAuthenticationError = (error: ApiError): boolean => {
  return error.status === 401;
};

/**
 * Checks if the error indicates a network issue
 */
export const isNetworkError = (error: ApiError): boolean => {
  return (
    error.message.includes('Network Error') ||
    error.message.includes('timeout') ||
    error.status === 502 ||
    error.status === 503
  );
};