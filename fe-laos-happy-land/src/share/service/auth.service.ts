import api from "./api.service";
import type { LoginDto, RegisterDto } from "@/@types/gentype-axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  createdAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  avatarUrl: string | null;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
}

export interface AuthResponse {
  access_token?: string;
  user?: User;
  message?: string;
}

interface TokenPayload {
  sub?: string;
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
  role?: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.authControllerLogin(data as LoginDto);
      const loginData = response.data as unknown as LoginResponse;

      if (loginData.access_token) {
        // Decode JWT để lấy user info (hoặc call API khác để lấy user info)
        const userInfo = this.decodeTokenPayload(loginData.access_token);
        return {
          access_token: loginData.access_token,
          user: userInfo ?? undefined,
        };
      }

      return { message: "Đăng nhập thất bại" };
    } catch (error: unknown) {
      // Re-throw the error with proper structure for LoginForm to catch
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string; statusCode?: number };
          };
        };
        if (axiosError.response?.data) {
          // Create a structured error that LoginForm can handle
          const apiError = new Error(
            axiosError.response.data.message ?? "Đăng nhập thất bại",
          );
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.authControllerRegister(data as RegisterDto);
      const registerData = response.data as unknown as RegisterResponse;

      if (registerData.id) {
        // Convert register response to user format
        const userInfo: User = {
          id: registerData.id,
          email: registerData.email,
          fullName: registerData.fullName,
          role: registerData.role,
        };

        // For register, we need to create a temporary token or ask user to login
        // Since API doesn't return access_token, we'll ask user to login
        return {
          user: userInfo,
          message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.",
        };
      }

      return { message: "Đăng ký thất bại" };
    } catch (error: unknown) {
      // Re-throw the error with proper structure for RegisterForm to catch
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string; statusCode?: number };
          };
        };
        if (axiosError.response?.data) {
          // Create a structured error that RegisterForm can handle
          const apiError = new Error(
            axiosError.response.data.message ?? "Đăng ký thất bại",
          );
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  decodeTokenPayload(token: string): User | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) {
        throw new Error("Invalid JWT format");
      }

      const payload = JSON.parse(atob(parts[1])) as TokenPayload;
      return {
        id: payload.sub ?? payload.id ?? "",
        email: payload.email ?? "",
        fullName: payload.fullName ?? payload.name ?? "User",
        role: payload.role ?? "user",
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return {
        id: "",
        email: "",
        fullName: "User",
        role: "user",
      };
    }
  },

  logout(): void {
    // Clear localStorage and cookies - only token
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("access_token");
        // Clear cookie
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } catch (error) {
        console.error("Error clearing auth data:", error);
      }
    }
  },

  setAuthToken(token: string) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("access_token", token);
        // Set cookie for middleware with proper attributes
        const cookieValue = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
        document.cookie = cookieValue;

        // Also try setting with domain if available
        if (window.location.hostname !== "localhost") {
          document.cookie = `${cookieValue}; domain=${window.location.hostname}`;
        }

        console.log("Token set in localStorage and cookie");
      } catch (error) {
        console.error("Error setting auth token:", error);
      }
    }
  },

  getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("access_token");
      } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
      }
    }
    return null;
  },

  // Get user data from token (not from localStorage)
  getUserFromToken(): User | null {
    const token = this.getAuthToken();
    if (!token) return null;

    return this.decodeTokenPayload(token);
  },

  // Verify user role from server (optional - for additional security)
  async verifyUserRole(): Promise<User | null> {
    try {
      // You can add an API endpoint to verify the user's role
      // For now, we'll just return the decoded token data
      return this.getUserFromToken();
    } catch (error) {
      console.error("Error verifying user role:", error);
      return null;
    }
  },
};

export default authService;
