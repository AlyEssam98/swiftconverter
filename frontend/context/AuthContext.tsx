"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  token: string;
  email?: string;
  displayName?: string;
  credits?: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext(undefined as AuthContextType | undefined);

// Session key for sessionStorage (cleared on tab close)
const SESSION_KEY = 'session_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null as User | null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Force logout function - clears everything
  const forceLogout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('token');
    } catch (e) {
      // Ignore errors
    }
    setUser(null);
  }, []);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/profile');
      setUser((prev: User | null) => {
        if (prev) {
          return { ...prev, ...res.data };
        }
        return { token: '', ...res.data };
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
      // Don't throw - allow the app to continue without profile data
    }
  }, []);

  // Refresh user data (for credit updates after purchase)
  const refreshUser = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem(SESSION_KEY);
      if (token) {
        setUser({ token });
        // Fetch profile after a small delay to avoid race conditions
        try {
          await fetchUserProfile();
        } catch (err) {
          // Profile fetch failed, but don't block initialization
          console.error('Failed to fetch profile during init', err);
        }
      }
      // Set loading to false regardless of success/failure
      setIsLoading(false);
    };

    initializeAuth();
  }, []); // Empty dependency array - only run once on mount

  const login = (token: string) => {
    sessionStorage.setItem(SESSION_KEY, token);
    setUser({ token });
    // Don't immediately fetch profile - let the dashboard handle it
    // This prevents the infinite retry loop with OAuth2
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (e) {
      // Continue with local logout
    }
    forceLogout();
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
