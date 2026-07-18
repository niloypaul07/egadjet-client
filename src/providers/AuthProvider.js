'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { setAuthToken, getStoredUser, setStoredUser } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setStoredUser(data.user);
    } catch {
      setAuthToken(null);
      setStoredUser(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setAuthToken(data.token);
    setStoredUser(data.user);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setAuthToken(data.token);
    setStoredUser(data.user);
    setUser(data.user);
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post('/auth/google', { credential });
    setAuthToken(data.token);
    setStoredUser(data.user);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAuthToken(null);
      setStoredUser(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
