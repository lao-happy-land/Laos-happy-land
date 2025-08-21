"use client";

import { useState, useEffect } from "react";
import { authService } from "@/share/service/auth.service";
import type { User } from "@/share/service/auth.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Kiểm tra auth state khi component mount
    const { user: storedUser } = authService.getAuthData();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = "/";
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return {
    user: mounted ? user : null,
    isAuthenticated: mounted ? isAuthenticated : false,
    isLoading: mounted ? isLoading : true,
    logout,
    updateUser,
  };
}

export default useAuth;
