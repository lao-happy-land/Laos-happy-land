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
  phone: string;
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

export interface GoogleAuthResponse {
  access_token: string;
}

interface TokenPayload {
  sub?: string;
  id?: string;
  email?: string;
  phone?: string;
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
          phone: registerData.phone,
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

      // Properly decode base64 with Vietnamese character support
      const base64Payload = parts[1];
      // Add padding if needed
      const paddedPayload =
        base64Payload + "=".repeat((4 - (base64Payload.length % 4)) % 4);

      // Decode base64 to string with proper UTF-8 handling
      const decodedPayload = decodeURIComponent(
        atob(paddedPayload)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const payload = JSON.parse(decodedPayload) as TokenPayload;

      // Ensure fullName is properly handled for Vietnamese characters
      const fullName = payload.fullName ?? payload.name ?? "User";
      const phone = payload.phone ?? "";

      return {
        id: payload.sub ?? payload.id ?? "",
        email: payload.email ?? "",
        phone: phone,
        fullName: fullName,
        role: payload.role ?? "user",
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return {
        id: "",
        email: "",
        phone: "",
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

  // Google OAuth methods
  getGoogleLoginUrl(): string {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${backendUrl}api/auth/google/login`;
  },

  async handleGoogleCallback(token: string): Promise<AuthResponse> {
    try {
      if (!token) {
        throw new Error("No access token received from Google");
      }

      // Store token
      this.setAuthToken(token);

      // Decode user info from token
      const userInfo = this.decodeTokenPayload(token);

      return {
        access_token: token,
        user: userInfo ?? undefined,
      };
    } catch (error: unknown) {
      console.error("Google callback error:", error);
      if (typeof error === "object" && error !== null && "message" in error) {
        throw new Error((error as { message: string }).message);
      }
      throw new Error("Google authentication failed");
    }
  },

  async googleLogin(): Promise<void> {
    // Redirect to Google OAuth
    window.location.href = this.getGoogleLoginUrl();
  },

  async sendResetCode(email: string): Promise<void> {
    try {
      // Use the axios instance directly since the endpoint might not be in generated types
      const { apiInstance } = await import("./api.service");
      await apiInstance.post("/api/auth/send-reset-code", { email });
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string; statusCode?: number };
          };
        };
        if (axiosError.response?.data) {
          const apiError = new Error(
            axiosError.response.data.message ?? "Gửi mã xác nhận thất bại",
          );
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  async resetPasswordWithCode(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    try {
      // Use the axios instance directly since the endpoint might not be in generated types
      const { apiInstance } = await import("./api.service");
      await apiInstance.post("/api/auth/reset-password-with-code", {
        email,
        code,
        newPassword,
      });
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string; statusCode?: number };
          };
        };
        if (axiosError.response?.data) {
          const apiError = new Error(
            axiosError.response.data.message ?? "Đặt lại mật khẩu thất bại",
          );
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },
};

export default authService;
