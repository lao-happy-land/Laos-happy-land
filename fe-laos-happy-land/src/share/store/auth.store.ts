import { create } from "zustand";
import { authService } from "@/share/service/auth.service";
import type { User } from "@/share/service/auth.service";

// Helper function to get current locale from URL
const getCurrentLocale = (): string => {
  if (typeof window === "undefined") return "vn";
  const pathname = window.location.pathname;
  const localeRegex = /^\/(en|vn|la)(\/|$)/;
  const localeMatch = localeRegex.exec(pathname);
  return localeMatch?.[1] ?? "vn";
};

// Flag to prevent double redirect
let isRedirecting = false;

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
  logout: (redirectUrl?: string) => void;
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
      // Get current locale from URL path instead of store to ensure accuracy
      const locale = getCurrentLocale();

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

      // Prevent double redirect
      if (isRedirecting) return;
      isRedirecting = true;

      // Determine destination
      const destination =
        redirectUrl && redirectUrl !== "/"
          ? redirectUrl
          : userData?.role?.toLowerCase() === "admin"
            ? `/${locale}/admin`
            : `/${locale}/`;

      // Use replace to avoid adding to browser history
      window.location.replace(destination);
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
      // Get current locale from URL path instead of store to ensure accuracy
      const locale = getCurrentLocale();

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

      // Prevent double redirect
      if (isRedirecting) return;
      isRedirecting = true;

      // Determine destination
      const destination =
        finalRedirectUrl && finalRedirectUrl !== "/"
          ? finalRedirectUrl
          : userData?.role?.toLowerCase() === "admin"
            ? `/${locale}/admin`
            : `/${locale}/`;

      // Use replace to avoid adding to browser history
      window.location.replace(destination);
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

  logout: (redirectUrl?: string) => {
    // Get current locale from URL path instead of store to ensure accuracy
    const locale = getCurrentLocale();

    authService.logout();

    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    });

    // Use provided redirect URL or default to home page
    const finalRedirectUrl = redirectUrl ?? `/${locale}/`;
    window.location.replace(finalRedirectUrl);
  },
}));
