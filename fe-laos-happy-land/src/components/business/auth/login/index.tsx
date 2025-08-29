"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Alert } from "antd";
import LoginForm from "@/components/business/auth/login/login-form";
import { ArrowLeft, Building2 } from "lucide-react";

export default function Login() {
  const [loginError, setLoginError] = useState<string>("");
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") ?? undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="flex min-h-screen">
        <div className="relative hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
          <Image
            src="/images/auth/login-background.jpg"
            alt="Login Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 px-8 text-center text-white">
            <div className="mb-8 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold">Chào mừng trở lại!</h1>
            <p className="mb-8 text-xl text-orange-100">
              Khám phá những cơ hội bất động sản tuyệt vời tại Lào
            </p>
            <div className="flex items-center justify-center space-x-8 text-orange-100">
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm">Bất động sản</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Khách hàng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Dự án</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#fc746f]"
              >
                <ArrowLeft className="h-4 w-4" />
                Về trang chủ
              </Link>

              <div className="mb-6 flex items-center justify-center lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <Building2 className="h-6 w-6 text-[#fc746f]" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
              <p className="mt-2 text-gray-600">
                Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
              </p>
            </div>

            {/* Login Form */}
            {loginError && (
              <Alert
                message="Lỗi đăng nhập"
                description={loginError}
                type="error"
                showIcon
                closable
                onClose={() => setLoginError("")}
                className="mb-6"
              />
            )}

            <LoginForm
              redirectUrl={redirectUrl ?? undefined}
              onError={(error) => {
                setLoginError(error);
              }}
            />

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#fc746f] transition-colors hover:text-[#ff8a80]"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Bằng cách đăng nhập, bạn đồng ý với{" "}
                <a href="#" className="text-[#fc746f] hover:text-[#ff8a80]">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-[#fc746f] hover:text-[#ff8a80]">
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
