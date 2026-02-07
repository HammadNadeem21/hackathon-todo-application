import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'better-auth/react';
import { getToken, isTokenValid, removeToken } from '../utils/token-storage';

interface UseAuthReturn {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  checkAuthStatus: () => void;
}

/**
 * Custom hook for handling authentication state
 */
export const useAuth = (): UseAuthReturn => {
  const { data: session, isLoading } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isLoading) {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          // Check if there's a valid token in storage
          if (getToken() && isTokenValid()) {
            // If token exists but no session, try to sync
            // This is useful for cases where the token exists but session hasn't loaded yet
            setUser(session?.user || null);
            setIsAuthenticated(!!session?.user);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
        setLoading(false);
      }
    };

    initializeAuth();
  }, [session, isLoading]);

  const login = async (email: string, password: string) => {
    try {
      await signIn('credentials', {
        email,
        password,
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        // Automatically sign in after registration
        await signIn('credentials', {
          email,
          password,
          callbackURL: '/dashboard',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove token from storage
      removeToken();

      // Sign out using Better Auth
      await signOut({ callbackURL: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, ensure the token is removed
      removeToken();
    }
  };

  const checkAuthStatus = () => {
    // Check if the token is still valid
    const valid = isTokenValid();
    setIsAuthenticated(valid);
    if (!valid) {
      setUser(null);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    checkAuthStatus,
  };
};