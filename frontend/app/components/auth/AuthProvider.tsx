'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '@/lib/auth';
import { loginUser, logoutUser, registerUser, getCurrentUser } from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; errors?: string[] }>;
  logout: () => Promise<void>;
  register: (name: string, mail: string, pass: string) => Promise<{ success: boolean; errors?: string[] }>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (username: string, password: string) => {
    const result = await loginUser(username, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const register = async (name: string, mail: string, pass: string) => {
    return registerUser(name, mail, pass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
