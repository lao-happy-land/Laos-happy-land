"use client";

import { useState } from "react";
import { authService } from "@/services/auth.service";
import type { RegisterRequest } from "@/services/auth.service";

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: (message: string) => void;
}

export default function RegisterForm({ onSuccess, onError, onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    fullName: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!form.email || !form.fullName || !form.password || !form.phone) {
      setError("Vui lòng điền đầy đủ thông tin");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    if (!form.email.includes("@")) {
      setError("Email không hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register(form);
      
      if (response.access_token && response.user) {
        // Nếu có access_token (auto login sau khi register)
        authService.setAuthData(response.access_token, response.user);
        onSuccess?.();
        window.location.reload();
      } else if (response.user && response.message) {
        // Nếu register thành công nhưng cần login
        setSuccessMessage(response.message);
        onRegisterSuccess?.(response.message);
        // Auto switch to login after 2 seconds
        setTimeout(() => {
          onSwitchToLogin?.();
        }, 2000);
      } else {
        const errorMsg = response.message ?? "Đăng ký thất bại";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err: unknown) {
      let errorMsg = "Có lỗi xảy ra khi đăng ký";
      
      console.log("Register error details:", err);
      
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
      console.error("Register error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Đăng ký tài khoản
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

      {successMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm">
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên *
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Nhập họ và tên"
            value={form.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
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
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại *
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mật khẩu phải có ít nhất 6 ký tự
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-red-500 py-3 font-medium text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              Đang đăng ký...
            </div>
          ) : (
            "Đăng ký"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-red-500 hover:underline"
          >
            Đăng nhập tại đây
          </button>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <a href="#" className="text-red-500 underline">
            Điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a href="#" className="text-red-500 underline">
            Chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}
