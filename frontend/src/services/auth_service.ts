/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Authentication Service for handling user authentication flows
 */
import apiClient from './api_client';
import { LoginResponse } from './api_client';

interface UserPayload {
  sub: string;
  email: string;
  exp: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  exp: number;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(email: string, password: string): Promise<any> {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password
      });

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user and store JWT token
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password
      });

      // Store the token for future API requests
      if (response.access_token) {
        apiClient.setAuthToken(response.access_token);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user and clear JWT token
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      // Call the logout endpoint (if exists)
      // await apiClient.post('/auth/logout');

      // Clear the stored token
      apiClient.removeAuthToken();

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const token = apiClient.getAuthToken();

    if (!token) {
      return false;
    }

    // Decode the token to check if it's expired
    try {
      const payload = this.parseJWT(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, remove it
        apiClient.removeAuthToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Parse JWT token to get payload
   */
  parseJWT(token: string): UserPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT parsing error:', error);
      throw error;
    }
  }

  /**
   * Get current user info from token
   */
  getCurrentUser(): CurrentUser | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    const token = apiClient.getAuthToken();
    if (!token) {
      return null;
    }

    const payload = this.parseJWT(token);

    return {
      id: payload.sub,
      email: payload.email,
      exp: payload.exp
    };
  }

  /**
   * Refresh JWT token if needed
   */
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    const token = apiClient.getAuthToken();
    if (!token) {
      return false;
    }

    const payload = this.parseJWT(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;

    // Refresh token if it expires in less than 5 minutes
    if (timeUntilExpiry < 300) { // 5 minutes in seconds
      try {
        // In a real implementation, you would call a refresh endpoint
        // For now, we'll just return false indicating the user needs to re-authenticate
        return false;
      } catch (error) {
        console.error('Token refresh error:', error);
        return false;
      }
    }

    return true;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;

// Export the class for potential instantiation with custom config
export { AuthService };