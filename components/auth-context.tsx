"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { adminApi } from '@/services/adminApi';
import { disconnectRealtimeSocket } from '@/lib/socket/realtime-client';

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (user: any, token: string) => void;
  updateUser: (updates: Record<string, unknown>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isUsableJwt = (token: string): boolean => {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(atob(parts[1]));
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

  const login = async (user: any, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('accessToken', token);
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
    setUser(null);
    setToken(null);
    disconnectRealtimeSocket();
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // Clear active RTK Query cache on logout to ensure data security
    store.dispatch(adminApi.util.resetApiState());
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
