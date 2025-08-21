"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/share/hook/useAuth";
import { useAuthModal } from "@/share/hook/useAuthModal";
import type { User } from "@/share/service/auth.service";

const NAV_ITEMS = [
  {
    title: "Nhà đất bán",
    href: "/properties-for-sale",
  },
  {
    title: "Nhà đất cho thuê",
    href: "",
  },
  {
    title: "Dự án",
    href: "",
  },
  {
    title: "Tin tức",
    href: "",
  },
  {
    title: "Wiki BĐS",
    href: "",
  },
  {
    title: "Phân tích đánh giá",
    href: "",
  },
  {
    title: "Danh bạ",
    href: "",
  },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { openLogin, openRegister, AuthModalComponent } = useAuthModal();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Helper function to get display name
  const getDisplayName = (user: User | null): string => {
    if (!user) return "User";

    // If fullName exists and is not "User", use it
    if (user.fullName?.trim() && user.fullName !== "User") {
      return user.fullName;
    }

    // Otherwise, use full email
    if (user.email) {
      return user.email;
    }

    return "User";
  };

  const buttonClass = `rounded-lg text-gray-900 transition-colors hover:bg-gray-100 ${
    isScrolled ? "px-2 py-2" : "px-4 py-3"
  }`;

  const displayName = getDisplayName(user);

  return (
    <>
      {/* Container ngoài trong suốt với height cố định */}
      <div className="sticky top-0 z-50 h-20 w-full">
        <header
          className={`flex items-center bg-white px-4 shadow-xl transition-all duration-200 ${
            isScrolled ? "h-auto py-1" : "h-full py-4"
          }`}
        >
          <div className="mx-auto flex h-16 w-full items-center justify-between">
            {/* Left side */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-3">
                  <div
                    className={`flex items-center justify-center rounded-lg bg-blue-600 transition-all duration-300 ${isScrolled ? "h-10 w-10" : "h-12 w-12"}`}
                  >
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
                    <div
                      className={`${isScrolled ? "text-xl" : "text-2xl"} font-bold text-blue-600 transition-all duration-300`}
                    >
                      Lào BDS
                    </div>
                    <div className="-mt-1 text-xs text-gray-500">
                      Bất động sản Lào
                    </div>
                  </div>
                </Link>
              </div>

              <nav className="hidden items-center space-x-6 text-sm lg:flex">
                {NAV_ITEMS.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="relative text-gray-900 before:absolute before:-bottom-[2px] before:left-0 before:h-[2px] before:w-0 before:bg-[#E03C31] before:transition-all before:duration-300 hover:text-[#E03C31] hover:before:w-full"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Desktop actions */}
              <div className="hidden items-center space-x-2 lg:flex">
                {isAuthenticated && user ? (
                  <div className="relative z-20">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors hover:bg-gray-100"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:block">{displayName}</span>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>

                    {showUserMenu && (
                      <div className="ring-opacity-5 absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black">
                        <Link
                          href="/user/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/user/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Thông tin cá nhân
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button onClick={openLogin} className={buttonClass}>
                      Đăng nhập
                    </button>
                    <span className="h-5 w-px bg-gray-300"></span>
                    <button onClick={openRegister} className={buttonClass}>
                      Đăng ký
                    </button>
                  </>
                )}

                <button
                  className={`all rounded-lg border border-gray-300 transition-all duration-300 hover:bg-gray-100 ${isScrolled ? "px-2 py-2" : "px-4 py-3"}`}
                >
                  Đăng tin
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {showSidebar && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 z-50 h-full w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden">
            <div className="p-4">
              <div className="mb-6">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{displayName}</span>
                    </div>
                    <Link
                      href="/user/dashboard"
                      className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-white transition-colors hover:bg-blue-700"
                      onClick={() => setShowSidebar(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center transition-colors hover:bg-gray-50"
                      onClick={() => setShowSidebar(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                    <button
                      onClick={() => {
                        setShowSidebar(false);
                        logout();
                      }}
                      className="block w-full rounded-lg border border-red-200 px-4 py-3 text-center text-red-600 transition-colors hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Đăng nhập và Đăng ký nằm ngang */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowSidebar(false);
                          openLogin();
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-center transition-colors hover:bg-gray-50"
                      >
                        Đăng nhập
                      </button>
                      <button
                        onClick={() => {
                          setShowSidebar(false);
                          openRegister();
                        }}
                        className="flex-1 rounded-lg bg-[#E03C31] px-4 py-3 text-center text-white transition-colors hover:bg-[#c32f25]"
                      >
                        Đăng ký
                      </button>
                    </div>
                    {/* Đăng tin */}
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center transition-colors hover:bg-gray-50"
                    >
                      Đăng tin
                    </button>
                  </div>
                )}
              </div>

              <nav className="mb-6">
                {NAV_ITEMS.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="block rounded-lg px-2 py-3 text-gray-900 transition-colors hover:bg-gray-50 hover:text-[#E03C31]"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      <AuthModalComponent />
    </>
  );
}
