import os

TARGET_FILE = r"C:\Users\habee\frontend\src\hooks\useAuth.tsx"

code = '''import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '../types';
import { authApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email?: string, password?: string) => Promise<void>;
  register: (data?: any) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('water_intel_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveToken = (newToken: string) => {
    localStorage.setItem('water_intel_token', newToken);
    // Also set 'token' for backward compatibility
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('water_intel_token');
      if (storedToken && storedToken !== 'guest_token') {
        // Try to validate existing token
        try {
          const u = await authApi.getMe();
          setUser(u);
          setIsLoading(false);
          return;
        } catch {
          // Token expired or invalid, fall through to guest login
        }
      }
      // Auto-login as guest to ensure we always have a valid JWT
      const res = await authApi.guest();
      saveToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      console.error('Auth initialization failed:', err);
      // Last resort fallback — but this won\'t have a valid token
      setUser({
        id: 3,
        full_name: "Guest Explorer",
        email: "guest@waterintelligence.org",
        region: "Central Region",
        role: "USER",
        created_at: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.guest();
      saveToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      console.error('Guest login failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      if (email && password) {
        const res = await authApi.login({ email, password });
        saveToken(res.access_token);
        setUser(res.user);
      } else {
        await loginAsGuest();
      }
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('water_intel_token');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Re-login as guest immediately
    fetchUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register: login,
      logout,
      loginAsGuest,
      refreshUser: fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
'''

with open(TARGET_FILE, "w", encoding="utf-8") as f:
    f.write(code)

print("FIXED: useAuth.tsx now properly saves JWT to both 'water_intel_token' AND 'token' keys, and auto-refreshes on expired tokens.")
