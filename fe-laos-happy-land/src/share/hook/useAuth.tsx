"use client";

import { useState, useEffect } from 'react';
import { authService } from '@/share/service/auth.service';
import type { User } from '@/share/service/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra auth state khi component mount
    const { user: storedUser } = authService.getAuthData();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateUser,
  };
}

export default useAuth;
