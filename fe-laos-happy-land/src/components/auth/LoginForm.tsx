"use client";

import { useState } from "react";
import { authService } from "@/services/auth.service";
import type { LoginRequest } from "@/services/auth.service";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSuccess, onError, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!form.email || !form.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      setIsLoading(false);
      return;
    }

    if (!form.email.includes("@")) {
      setError("Email không hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login(form);
      
      if (response.access_token && response.user) {
        authService.setAuthData(response.access_token, response.user);
        onSuccess?.();
        // Redirect hoặc reload page
        window.location.reload();
      } else {
        const errorMsg = response.message ?? "Đăng nhập thất bại";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err: unknown) {
      let errorMsg = "Có lỗi xảy ra khi đăng nhập";
      
      console.log("Login error details:", err);
      
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string; error?: string; statusCode?: number } } }).response;
        
        // Ưu tiên lấy message trước
        if (response?.data?.message) {
          errorMsg = String(response.data.message);
        } else if (response?.data?.error) {
          errorMsg = String(response.data.error);
        }
      } else if (typeof err === 'object' && err !== null && 'data' in err) {
        // Trường hợp response trực tiếp có data
        const data = (err as { data?: { message?: string; error?: string; statusCode?: number } }).data;
        if (data?.message) {
          errorMsg = String(data.message);
        } else if (data?.error) {
          errorMsg = String(data.error);
        }
      }
      
      setError(errorMsg);
      onError?.(errorMsg);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Đăng nhập
      </h2>
      
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm">
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Nhập địa chỉ email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-gray-700">Nhớ tài khoản</span>
          </label>
          <a href="#" className="text-red-500 hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-red-500 py-3 font-medium text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              Đang đăng nhập...
            </div>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <button
            onClick={onSwitchToRegister}
            className="font-medium text-red-500 hover:underline"
          >
            Đăng ký tại đây
          </button>
        </p>
      </div>
    </div>
  );
}
