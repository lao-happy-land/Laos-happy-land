import { create } from "zustand";
import { authService } from "@/share/service/auth.service";
import type { User } from "@/share/service/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (
    email: string,
    password: string,
    redirectUrl?: string,
  ) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  initialize: () => {
    try {
      const userData = authService.getUserFromToken();
      const token = authService.getAuthToken();

      set({
        user: userData,
        isAuthenticated: !!userData && !!token,
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  login: async (email: string, password: string, redirectUrl?: string) => {
    try {
      // Use auth service to handle login
      const response = await authService.login({ email, password });

      if (!response.access_token) {
        throw new Error("No access token received");
      }

      // Store token (handles both localStorage and cookie)
      authService.setAuthToken(response.access_token);

      const userData = authService.getUserFromToken();

      // Login successful - auth store updated

      set({
        user: userData,
        isAuthenticated: !!userData,
      });

      // Small delay to ensure cookie is fully processed by browser
      setTimeout(() => {
        if (redirectUrl && redirectUrl !== "/") {
          window.location.replace(redirectUrl);
        } else if (userData?.role?.toLowerCase() === "admin") {
          window.location.replace("/admin");
        } else {
          window.location.replace("/");
        }
      }, 500); // Longer delay to ensure cookie is processed
    } catch (error: unknown) {
      console.error("Login error:", error);
      set({
        user: null,
        isAuthenticated: false,
      });
      throw error; // Re-throw to let component handle the error
    }
  },

  logout: () => {
    authService.logout();

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
