"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/auth/AuthModal";
import SavedPostsPanel from "./SavedPostsPanel";

// Dữ liệu menu
const NAV_ITEMS = [
  {
    title: "Nhà đất bán",
    url: "/nha-dat-ban",
    icon: "🏠",
    subItems: [
      { title: "Bán căn hộ chung cư", url: "/nha-dat-ban/can-ho" },
      {
        title: "Bán chung cư mini, căn hộ dịch vụ",
        url: "/nha-dat-ban/chung-cu-mini",
      },
      { title: "Bán nhà riêng", url: "/nha-dat-ban/nha-rieng" },
      { title: "Bán nhà biệt thự, liền kề", url: "/nha-dat-ban/biet-thu" },
      { title: "Bán nhà mặt phố", url: "/nha-dat-ban/nha-mat-pho" },
      {
        title: "Bán shophouse, nhà phố thương mại",
        url: "/nha-dat-ban/shophouse",
      },
      { title: "Bán đất nền dự án", url: "/nha-dat-ban/dat-nen" },
      { title: "Bán đất", url: "/nha-dat-ban/dat" },
    ],
  },
  {
    title: "Nhà đất cho thuê",
    url: "/nha-dat-cho-thue",
    icon: "🏢",
    subItems: [
      { title: "Cho thuê căn hộ", url: "/nha-dat-cho-thue/can-ho" },
      { title: "Cho thuê nhà riêng", url: "/nha-dat-cho-thue/nha-rieng" },
    ],
  },
  { title: "Dự án", url: "/du-an", icon: "🏗️" },
  { title: "Tin tức", url: "/tin-tuc", icon: "📰" },
];

const buttonClass =
  "rounded-lg px-4 py-3 text-stone-950 transition-colors hover:bg-gray-100 cursor-pointer font-medium";

export default function Header() {
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const offcanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        offcanvasRef.current &&
        !offcanvasRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white px-4 shadow-xl transition-all duration-300 ${
          isScrolled ? "py-2" : "py-2"
        }`}
      >
        <div className="mx-auto transition-all duration-300">
          {/* Mobile Header */}
          <div className="relative flex items-center justify-end lg:hidden">
            {/* Logo center */}
            <Link
              href="/"
              className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center space-x-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <svg
                  className="h-6 w-6 text-white"
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
                <div className="text-xl font-bold text-blue-600">Lào BDS</div>
                <div className="-mt-1 text-xs text-gray-500">
                  Bất động sản Lào
                </div>
              </div>
            </Link>

            {/* Right side */}
            <div className="z-10 flex items-center gap-3">
              <SavedPostsPanel isScrolled={isScrolled} />
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Toggle menu"
                className="block"
              >
                <svg
                  className="h-6 w-6 text-stone-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden items-center justify-between lg:flex">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div
                  className={`flex items-center justify-center rounded-lg bg-blue-600 transition-all duration-300 ${
                    isScrolled ? "h-9 w-9" : "h-12 w-12"
                  }`}
                >
                  <svg
                    className={`text-white transition-all duration-300 ${
                      isScrolled ? "h-6 w-6" : "h-8 w-8"
                    }`}
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
                    className={`font-bold text-blue-600 transition-all duration-300 ${
                      isScrolled ? "text-xl" : "text-2xl"
                    }`}
                  >
                    Lào BDS
                  </div>
                  <div className="-mt-1 text-xs text-gray-500">
                    Bất động sản Lào
                  </div>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center space-x-6 text-sm">
                {NAV_ITEMS.map((item, idx) => (
                  <div key={idx} className="group relative">
                    <Link
                      href={item.url}
                      className="relative font-medium text-stone-950 before:absolute before:-bottom-[3px] before:left-0 before:h-[2px] before:w-0 before:bg-[#E03C31] before:transition-all before:duration-300 hover:text-[#E03C31] hover:before:w-full"
                    >
                      {item.title}
                    </Link>
                    {item.subItems && (
                      <div className="invisible absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-lg bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        {item.subItems.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.url}
                            className="block px-4 py-2 text-sm text-stone-900 hover:bg-gray-100"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 text-sm">
              <SavedPostsPanel isScrolled={isScrolled} />
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
              <button
                className={`cursor-pointer rounded-lg border border-gray-300 px-4 font-medium transition-all hover:bg-gray-100 ${
                  isScrolled ? "py-2" : "py-3"
                }`}
              >
                Đăng tin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offcanvas Menu Mobile */}

      {menuOpen && (
        <div className="bg-opacity-40 fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"></div>
      )}

      <div
        ref={offcanvasRef}
        className={`fixed top-0 right-0 z-50 h-full w-80 transform bg-white shadow-2xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Nút đăng nhập / đăng ký */}
        <div className="flex gap-3 px-4 pt-4">
          <Link
            href="/login"
            className="items-centerrounded-lg flex flex-1 justify-center rounded-lg border border-gray-300 py-3 font-medium hover:bg-gray-100"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="flex flex-1 items-center justify-center rounded-lg bg-red-500 py-3 font-medium text-white hover:bg-red-600"
          >
            Đăng ký
          </Link>
        </div>

        {/* Nút đăng tin */}
        <div className="mt-3 px-4">
          <button className="w-full rounded-lg border border-gray-300 py-3 font-medium hover:bg-gray-100">
            Đăng tin
          </button>
        </div>

        {/* Danh sách menu */}
        <div className="mt-4 border-t border-gray-200">
          {NAV_ITEMS.map((item, idx) => {
            const isOpen = openSubMenu === item.title;
            return (
              <div key={idx} className="border-b border-gray-100">
                <div
                  className={`relative flex items-center justify-between px-4 py-3 ${isOpen ? "bg-gray-100 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:bg-[#E03C31] before:content-['']" : ""} `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <Link
                      href={item.url}
                      onClick={() => setMenuOpen(false)}
                      className="font-medium"
                    >
                      {item.title}
                    </Link>
                  </div>
                  {item.subItems && (
                    <button
                      onClick={() => setOpenSubMenu(isOpen ? null : item.title)}
                      className="p-1"
                    >
                      {isOpen ? "−" : "+"}
                    </button>
                  )}
                </div>

                {item.subItems && isOpen && (
                  <div className="ml-12 flex flex-col pb-2">
                    {item.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.url}
                        onClick={() => setMenuOpen(false)}
                        className="py-2 pr-2 text-sm text-stone-700 hover:text-blue-600"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
