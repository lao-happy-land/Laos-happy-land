"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/share/hook/useAuth';
import { useAuthModal } from '@/share/hook/useAuthModal';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLogin, AuthModalComponent } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/');
      } else {
        openLogin();
      }
    }
  }, [isAuthenticated, isLoading, router, openLogin]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Chào mừng đến với Laos Happy Land
        </h1>
        <p className="mb-6 text-gray-600">
          Vui lòng đăng nhập để tiếp tục
        </p>
        <button
          onClick={openLogin}
          className="rounded bg-red-500 px-6 py-2 font-medium text-white transition hover:bg-red-600"
        >
          Đăng nhập
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => router.push('/register')}
            className="font-medium text-red-500 hover:underline"
          >
            Đăng ký tại đây
          </button>
        </p>
      </div>
      <AuthModalComponent />
    </div>
  );
}
