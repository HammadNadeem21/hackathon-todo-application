/**
 * Tests for responsive design
 */

import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import RegisterPage from '@/app/register/page';
import LoginPage from '@/app/login/page';
import DashboardPage from '@/app/dashboard/page';

describe('Responsive Design', () => {
  // Helper function to set viewport size
  const setViewportSize = (width, height) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: width,
    });

    // Trigger resize event to update layout
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    // Reset viewport to desktop size
    setViewportSize(1200, 800);
  });

  describe('Mobile Layout', () => {
    it('renders login page correctly on mobile', () => {
      setViewportSize(375, 667); // iPhone SE size

      render(<LoginPage />);

      // Check that essential elements are present
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders register page correctly on mobile', () => {
      setViewportSize(375, 667); // iPhone SE size

      render(<RegisterPage />);

      // Check that essential elements are present
      expect(screen.getByText(/create your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('renders dashboard page correctly on mobile', () => {
      setViewportSize(375, 667); // iPhone SE size

      // Mock auth service
      jest.mock('@/services/auth_service', () => ({
        default: {
          isAuthenticated: jest.fn().mockReturnValue(true),
          getCurrentUser: jest.fn().mockReturnValue({ email: 'test@example.com' }),
        },
      }));

      render(<DashboardPage />);

      // Check that essential elements are present
      expect(screen.getByText(/todo dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/manage your tasks/i)).toBeInTheDocument();
    });
  });

  describe('Tablet Layout', () => {
    it('renders pages correctly on tablet', () => {
      setViewportSize(768, 1024); // iPad size

      render(<LoginPage />);

      // Check that essential elements are present
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Desktop Layout', () => {
    it('renders pages correctly on desktop', () => {
      setViewportSize(1200, 800); // Desktop size

      render(<LoginPage />);

      // Check that essential elements are present
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });
});