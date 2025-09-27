'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, you'd check for a token in localStorage here
    setLoading(false);
  }, []);

  const login = useCallback(
    (email: string) => {
      setUser({ email });
      router.push('/dashboard');
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
