"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { adminApi } from '@/services/adminApi';
import { disconnectRealtimeSocket } from '@/lib/socket/realtime-client';
import { getPersister, getQueryClient } from '@/lib/react-query/queryClient';

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (user: any, accessToken: string, refreshToken?: string) => void;
  updateUser: (updates: Record<string, unknown>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isUsableJwt = (token: string): boolean => {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    // JWT uses base64URL encoding — convert to standard base64 before atob()
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (typeof payload?.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) return false;
    }
    return true;
  } catch {
    return false;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token and user from localStorage on mount
    const storedToken = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser && isUsableJwt(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else if (storedToken && !isUsableJwt(storedToken)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    setLoading(false); // Set loading to false after checking localStorage
  }, []);

  const login = async (user: any, accessToken: string, refreshToken?: string) => {
    setUser(user);
    setToken(accessToken);
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(user));
  };

  const updateUser = (updates: Record<string, unknown>) => {
    setUser((prev: any) => {
      const nextUser = { ...(prev || {}), ...updates };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = () => {
    const accessToken = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1'}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {
        // Local logout should still complete even if the network request fails.
      });
    }

    setUser(null);
    setToken(null);
    disconnectRealtimeSocket();
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Clear active RTK Query cache on logout to ensure data security
    store.dispatch(adminApi.util.resetApiState());

    // Clear TanStack Query cache (and persisted IndexedDB) on logout to avoid cross-account leakage.
    try {
      getQueryClient().clear();
      void getPersister().removeClient();
    } catch {
      // Ignore cache clear failures; local logout should still complete.
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
