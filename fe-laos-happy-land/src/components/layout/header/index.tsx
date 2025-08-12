"use client";

import { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/auth/AuthModal";

const NAV_ITEMS = [
  "Nhà đất bán",
  "Nhà đất cho thuê",
  "Dự án",
  "Tin tức",
  "Wiki BĐS",
  "Phân tích đánh giá",
  "Danh bạ",
];

const buttonClass =
  "rounded-lg px-4 py-3 text-gray-900 transition-colors hover:bg-gray-100";

export default function Header() {
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);

  return (
    <>
      <header className="bg-white p-4 shadow-xl">
        <div className="mx-auto flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex gap-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 21l4-4 4 4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    Lào BDS
                  </div>
                  <div className="-mt-1 text-xs text-gray-500">
                    Bất động sản Lào
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden items-center space-x-6 text-sm lg:flex">
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="relative text-gray-900 before:absolute before:-bottom-[2px] before:left-0 before:h-[2px] before:w-0 before:bg-[#E03C31] before:transition-all before:duration-300 hover:text-[#E03C31] hover:before:w-full"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 text-sm">
            <a href="#" className={buttonClass}>
              Tải ứng dụng
            </a>
            <button className={buttonClass}>❤️</button>
            <button
              onClick={() => setModalType("login")}
              className={buttonClass}
            >
              Đăng nhập
            </button>
            <span className="h-5 w-px bg-gray-300"></span>
            <button
              onClick={() => setModalType("register")}
              className={buttonClass}
            >
              Đăng ký
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-100">
              Đăng tin
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      {modalType && (
        <AuthModal
          type={modalType}
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}
