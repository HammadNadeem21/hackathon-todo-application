/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Client Service for handling HTTP requests to the backend
 */

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

class APIClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.token = null;
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Get authentication token from storage
   */
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Get authorization header
   */
  getAuthHeader(): Record<string, string> {
    const token = this.token || this.getAuthToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make an HTTP request
   */
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...this.getAuthHeader(), ...options.headers };

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      ...(options.body && { body: JSON.stringify(options.body) })
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        // Optionally redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized: Please log in again');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;

        // Log error for debugging but don't expose sensitive information
        console.error(`API request error for ${url}:`, errorMessage);

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors or other exceptions
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error:', error);
        throw new Error('Network error: Please check your connection');
      }

      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Task management API methods (T025-T028, T032)

  async createTask(taskData: Partial<Task>): Promise<Task> {
    return this.post<Task>('/tasks/', taskData);
  }

  async getTasks(): Promise<Task[]> {
    return this.get<Task[]>('/tasks/');
  }

  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    return this.put<Task>(`/tasks/${taskId}`, taskData);
  }

  async deleteTask(taskId: string): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`/tasks/${taskId}`);
  }

  // Authentication API methods

  async register(userData: RegisterData): Promise<User> {
    return this.post<User>('/auth/register', userData);
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('/auth/login', credentials);
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    // Logout is handled client-side for JWT tokens
    this.removeAuthToken();
    return { success: true, message: 'Logged out successfully' };
  }
}

// Export singleton instance
const apiClient = new APIClient();
export default apiClient;

// Export the class for potential instantiation with custom config
export { APIClient };