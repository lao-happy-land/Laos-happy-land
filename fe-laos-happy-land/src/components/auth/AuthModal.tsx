"use client";

import { useState } from "react";
import Image from "next/image";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "register";
};

export default function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
  if (!isOpen) return null;
  const isLogin = type === "login";

  // State cho password visibility
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose} // Click ra ngoài sẽ đóng modal
    >
      <div
        className="relative flex w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong đóng modal
      >
        {/* Left side */}
        <div className="flex w-1/2 flex-col items-center justify-center bg-[#FFEFEF] p-6">
          <Image
            src="/images/auth/login-bg.png"
            alt="Auth Background"
            width={500}
            height={300}
            priority
          />
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            Tìm nhà đất <br />
            <span className="font-semibold">Batdongsan.com.vn dẫn lối</span>
          </p>
        </div>

        {/* Right side */}
        <div className="relative w-1/2 p-8">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 cursor-pointer text-xl text-stone-950 hover:text-gray-700"
          >
            &times;
          </button>

          <h2 className="mb-2 text-base font-semibold text-stone-950">
            Xin chào bạn
          </h2>
          <p className="mb-4 text-2xl font-medium text-stone-950">
            {isLogin ? "Đăng nhập để tiếp tục" : "Đăng ký tài khoản mới"}
          </p>

          {isLogin ? (
            <form className="space-y-4">
              <input
                type="text"
                placeholder="SĐT chính hoặc email"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="w-full rounded border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-stone-950"
                >
                  <Image
                    src={
                      showPassword
                        ? "/images/auth/eye-show.svg"
                        : "/images/auth/eye-hidden.svg"
                    }
                    alt={showPassword ? "Hiện mật khẩu" : "Ẩn mật khẩu"}
                    width={24}
                    height={24}
                    unoptimized
                  />
                </button>
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer rounded bg-red-500 py-2 font-medium text-white transition hover:bg-red-600"
              >
                Đăng nhập
              </button>
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input type="checkbox" />
                  <span>Nhớ tài khoản</span>
                </label>
                <a href="#" className="text-red-500 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            </form>
          ) : (
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full cursor-pointer rounded bg-red-500 py-2 font-medium text-white transition hover:bg-red-600"
              >
                Tiếp tục
              </button>
            </form>
          )}

          <div className="my-4 flex items-center justify-center text-sm text-stone-950">
            <span className="mx-2">Hoặc</span>
          </div>

          <div className="space-y-3">
            <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded border py-2 text-sm hover:bg-gray-100">
              <Image
                src="/images/auth/apple.svg"
                alt="Apple Icon"
                width={24}
                height={24}
                priority
              />
              Đăng nhập với Apple
            </button>
            <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded border py-2 text-sm hover:bg-gray-100">
              <Image
                src="/images/auth/google.svg"
                alt="Google Icon"
                width={24}
                height={24}
                priority
              />
              Đăng nhập với Google
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-stone-950">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <a href="#" className="text-red-500 underline">
              Điều khoản sử dụng
            </a>
            ,{" "}
            <a href="#" className="text-red-500 underline">
              Chính sách bảo mật
            </a>
            {isLogin ? "" : ", Quy chế, Chính sách của chúng tôi."}
          </p>

          {isLogin && (
            <p className="mt-2 text-center text-sm text-stone-950">
              Chưa là thành viên?{" "}
              <a href="#" className="font-medium text-red-500 hover:underline">
                Đăng ký tại đây
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
