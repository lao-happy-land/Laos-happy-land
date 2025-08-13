import api from './api.service';
import type { LoginDto, RegisterDto } from '@/apis/axios-gentype/api-axios';

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
      const response = await api.api.authControllerLogin(data as LoginDto);
      const loginData = response.data as unknown as LoginResponse;
      
      if (loginData.access_token) {
        // Decode JWT để lấy user info (hoặc call API khác để lấy user info)
        const userInfo = this.decodeTokenPayload(loginData.access_token);
        return {
          access_token: loginData.access_token,
          user: userInfo ?? undefined,
        };
      }
      
      return { message: 'Đăng nhập thất bại' };
    } catch (error: unknown) {
      // Re-throw the error with proper structure for LoginForm to catch
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string; statusCode?: number } } };
        if (axiosError.response?.data) {
          // Create a structured error that LoginForm can handle
          const apiError = new Error(axiosError.response.data.message ?? 'Đăng nhập thất bại');
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.api.authControllerRegister(data as RegisterDto);
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
          message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
        };
      }
      
      return { message: 'Đăng ký thất bại' };
    } catch (error: unknown) {
      // Re-throw the error with proper structure for RegisterForm to catch
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string; statusCode?: number } } };
        if (axiosError.response?.data) {
          // Create a structured error that RegisterForm can handle
          const apiError = new Error(axiosError.response.data.message ?? 'Đăng ký thất bại');
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  decodeTokenPayload(token: string): User | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) {
        throw new Error('Invalid JWT format');
      }
      
      const payload = JSON.parse(atob(parts[1])) as TokenPayload;
      return {
        id: payload.sub ?? payload.id ?? '',
        email: payload.email ?? '',
        fullName: payload.fullName ?? payload.name ?? 'User',
        role: payload.role ?? 'user',
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return {
        id: '',
        email: '',
        fullName: 'User',
        role: 'user',
      };
    }
  },

  logout() {
    // Clear localStorage or cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  setAuthData(token: string, user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  getAuthData() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      return {
        token,
        user: user ? (JSON.parse(user) as User) : null,
      };
    }
    return { token: null, user: null };
  },

  isAuthenticated(): boolean {
    const { token } = this.getAuthData();
    return !!token;
  },

  getAuthToken(): string | null {
    const { token } = this.getAuthData();
    return token;
  },
};

export default authService;
