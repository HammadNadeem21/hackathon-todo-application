import authService from '@/services/auth_service';
import apiClient from '@/services/api_client';

// Mock the API client
jest.mock('@/services/api_client');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call apiClient.register with correct parameters', async () => {
      const mockResponse = { id: '1', email: 'test@example.com' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authService.register('test@example.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when registration fails', async () => {
      const mockError = new Error('Registration failed');
      apiClient.post.mockRejectedValue(mockError);

      await expect(authService.register('test@example.com', 'password123')).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    it('should call apiClient.login and set auth token when successful', async () => {
      const mockResponse = { access_token: 'mock-token', token_type: 'bearer' };
      apiClient.post.mockResolvedValue(mockResponse);
      const setAuthTokenSpy = jest.spyOn(apiClient, 'setAuthToken');

      const result = await authService.login('test@example.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(setAuthTokenSpy).toHaveBeenCalledWith('mock-token');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists and is not expired', () => {
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn().mockReturnValue(createValidToken()),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn().mockReturnValue(null),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});

// Helper function to create a valid JWT token (with expiration in the future)
function createValidToken() {
  const payload = {
    sub: 'user-id',
    email: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  };

  // Encode as JWT (simplified - normally you wouldn't do this manually)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'signature'; // Not a real signature, just for mocking

  return `${header}.${encodedPayload}.${signature}`;
}