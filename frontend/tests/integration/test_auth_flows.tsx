/**
 * Integration tests for authentication flows
 */

// Mock the API client to simulate real API interactions
jest.mock('@/services/api_client');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterPage from '@/app/register/page';
import LoginPage from '@/app/login/page';
import apiClient from '@/services/api_client';

// Mock router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock auth service
jest.mock('@/services/auth_service', () => ({
  default: {
    register: jest.fn(),
    login: jest.fn(),
    isAuthenticated: jest.fn(),
    logout: jest.fn(),
  },
}));

import authService from '@/services/auth_service';

describe('Authentication Flows Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Registration Flow', () => {
    it('allows user to register and redirects to login', async () => {
      // Mock successful registration
      authService.register.mockResolvedValue({ id: '1', email: 'test@example.com' });
      apiClient.post.mockResolvedValue({ id: '1', email: 'test@example.com' });

      render(<RegisterPage />);

      // Find form elements
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /register/i });

      // Fill in form
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Wait for async operations
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it('shows error when registration fails', async () => {
      // Mock failed registration
      authService.register.mockRejectedValue(new Error('Registration failed'));

      render(<RegisterPage />);

      // Find form elements
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /register/i });

      // Fill in form
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Wait for async operations
      await waitFor(() => {
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login Flow', () => {
    it('allows user to login and redirects to dashboard', async () => {
      // Mock successful login
      authService.login.mockResolvedValue({ access_token: 'token123' });
      apiClient.post.mockResolvedValue({ access_token: 'token123' });

      render(<LoginPage />);

      // Find form elements
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Fill in form
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Wait for async operations
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});