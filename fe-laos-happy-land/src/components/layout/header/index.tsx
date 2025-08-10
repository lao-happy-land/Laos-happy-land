"use client";

import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Trang chủ", key: "home" },
    { href: "/mua-ban", label: "Mua bán", key: "buy-sell" },
    { href: "/cho-thue", label: "Cho thuê", key: "rent" },
    { href: "/du-an", label: "Dự án", key: "projects" },
    { href: "/tin-tuc", label: "Tin tức", key: "news" },
    { href: "/lien-he", label: "Liên hệ", key: "contact" },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+856201234567" className="flex items-center space-x-1 hover:text-blue-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>Hotline: +856 20 123 4567</span>
              </a>
              <a href="mailto:info@laoshappyland.com" className="flex items-center space-x-1 hover:text-blue-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>info@laoshappyland.com</span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dang-tin" className="hover:text-blue-200">
                Đăng tin miễn phí
              </Link>
              <span className="text-blue-200">|</span>
              <Link href="/quan-ly" className="hover:text-blue-200">
                Quản lý tin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21l4-4 4 4"/>
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                Lào BDS
              </div>
              <div className="text-xs text-gray-500 -mt-1">
                Bất động sản Lào
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* User menu */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/dang-nhap"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Đăng nhập
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/dang-ky"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Đăng ký
              </Link>
            </div>

            {/* Post Property Button */}
            <Link
              href="/dang-tin"
              className="hidden lg:block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Đăng tin
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Link
                  href="/dang-nhap"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/dang-ky"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký
                </Link>
                <Link
                  href="/dang-tin"
                  className="block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng tin
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
