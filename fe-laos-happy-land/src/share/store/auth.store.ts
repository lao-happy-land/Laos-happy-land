import { create } from "zustand";
import { authService } from "@/share/service/auth.service";
import type { User } from "@/share/service/auth.service";
import { useLocaleStore } from "./locale.store";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Add initialization flag

  // Actions
  login: (
    email: string,
    password: string,
    redirectUrl?: string,
  ) => Promise<void>;
  googleLogin: (redirectUrl?: string) => Promise<void>;
  handleGoogleCallback: (code: string, redirectUrl?: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: () => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window === "undefined") return;

    try {
      const userData = authService.getUserFromToken();
      const token = authService.getAuthToken();

      set({
        user: userData,
        isAuthenticated: !!userData && !!token,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },

  login: async (email: string, password: string, redirectUrl?: string) => {
    try {
      const locale = useLocaleStore.getState().getLocale();
      // Use auth service to handle login
      const response = await authService.login({ email, password });

      if (!response.access_token) {
        throw new Error("No access token received");
      }

      // Store token (handles both localStorage and cookie)
      authService.setAuthToken(response.access_token);

      const userData = authService.getUserFromToken();

      // Update auth store state immediately
      set({
        user: userData,
        isAuthenticated: !!userData,
        isInitialized: true,
      });

      // Use a longer delay to ensure cookie is properly set and middleware can read it
      setTimeout(() => {
        if (redirectUrl && redirectUrl !== "/") {
          window.location.href = redirectUrl;
        } else if (userData?.role?.toLowerCase() === "admin") {
          window.location.href = `/${locale}/admin`;
        } else {
          window.location.href = `/${locale}/`;
        }
      }, 1000); // Increased delay to ensure cookie is set
    } catch (error: unknown) {
      console.error("Login error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
      throw error; // Re-throw to let component handle the error
    }
  },

  googleLogin: async (redirectUrl?: string) => {
    try {
      // Store redirect URL for after Google OAuth
      if (redirectUrl) {
        sessionStorage.setItem("google_redirect_url", redirectUrl);
      }

      // Redirect to Google OAuth
      await authService.googleLogin();
    } catch (error: unknown) {
      console.error("Google login error:", error);
      throw error;
    }
  },

  handleGoogleCallback: async (token: string, redirectUrl?: string) => {
    try {
      const locale = useLocaleStore.getState().getLocale();
      // Use auth service to handle Google callback
      const response = await authService.handleGoogleCallback(token);

      if (!response.access_token) {
        throw new Error("No access token received from Google");
      }

      // Token is already stored by authService.handleGoogleCallback
      const userData = authService.getUserFromToken();

      // Update auth store state immediately
      set({
        user: userData,
        isAuthenticated: !!userData,
        isInitialized: true,
      });

      // Get redirect URL from sessionStorage or parameter
      const finalRedirectUrl =
        redirectUrl ?? sessionStorage.getItem("google_redirect_url");
      sessionStorage.removeItem("google_redirect_url");

      // Use a longer delay to ensure cookie is properly set and middleware can read it
      setTimeout(() => {
        if (finalRedirectUrl && finalRedirectUrl !== "/") {
          window.location.href = finalRedirectUrl;
        } else if (userData?.role?.toLowerCase() === "admin") {
          window.location.href = `/${locale}/admin`;
        } else {
          window.location.href = `/${locale}/`;
        }
      }, 1000);
    } catch (error: unknown) {
      console.error("Google callback error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
      throw error;
    }
  },

  logout: () => {
    const locale = useLocaleStore.getState().getLocale();
    authService.logout();
    window.location.href = `/${locale}/`;

    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },
}));
