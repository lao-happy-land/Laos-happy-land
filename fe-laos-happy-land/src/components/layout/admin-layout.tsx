"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/share/constant/admin-nav-constant";
import { useAuthStore } from "@/share/store/auth.store";
import { LogOut, User, Settings, Bell } from "lucide-react";
import { Button } from "antd";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = ADMIN_NAV_ITEMS(pathname);

  const getPageTitle = () => {
    const currentItem = menuItems.find((item) => item.active);
    return currentItem ? currentItem.label : "Dashboard";
  };

  const getBreadcrumbs = () => {
    const currentItem = menuItems.find((item) => item.active);
    return [
      { label: "Admin", href: "/admin" },
      {
        label: currentItem?.label ?? "Dashboard",
        href: currentItem?.href ?? "/admin",
      },
    ];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Enhanced Sidebar */}
      <aside
        className={`flex h-screen flex-col bg-white shadow-xl transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-center border-r border-b border-gray-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 p-2">
              <Image
                src="/images/admin/logo.svg"
                alt="Logo"
                width={24}
                height={24}
                className="object-contain brightness-0 invert filter"
              />
            </div>

            <div className={`${sidebarCollapsed ? "hidden" : "flex flex-col"}`}>
              <span className="text-lg font-bold whitespace-nowrap text-gray-900">
                Lào BDS
              </span>
              <span className="text-xs whitespace-nowrap text-gray-600">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 border-r border-gray-200 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {item.active && (
                    <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white"></div>
                  )}
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200 ${
                      item.active
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={16}
                      height={16}
                      className={`object-contain transition-all duration-200 ${
                        item.active
                          ? "brightness-0 invert filter"
                          : "grayscale group-hover:grayscale-0"
                      }`}
                    />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-r border-gray-200 p-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="group flex w-full items-center justify-center rounded-xl bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:text-gray-900 ${
                sidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Right Side Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 bg-white">
          <div className="flex h-full items-center justify-between px-6">
            {/* Page Title */}
            <div className="hidden items-center gap-2 md:flex">
              {getBreadcrumbs().map((breadcrumb, index) => (
                <div key={index}>
                  {index > 0 && <span className="text-gray-600"> / </span>}
                  <Link
                    href={breadcrumb.href}
                    className="text-gray-900 hover:text-blue-600"
                  >
                    {breadcrumb.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="group relative rounded-xl p-3 transition-all duration-200 hover:bg-gray-50">
                <Bell className="h-5 w-5 text-gray-600 transition-all duration-200 group-hover:scale-110 group-hover:text-gray-900" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="group flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-gray-50"
                >
                  <div className="relative">
                    {/* User Avatar - using first letter if no avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 ring-2 ring-gray-200 transition-all duration-200 group-hover:ring-blue-300">
                      <span className="text-sm font-medium text-white">
                        {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName ?? "User"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user?.email ?? "user@example.com"}
                    </p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName ?? "User"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {user?.email ?? "user@example.com"}
                      </p>
                      <p className="mt-1 text-xs font-medium text-blue-600 capitalize">
                        {user?.role ?? "user"}
                      </p>
                    </div>
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Cài đặt
                    </Link>
                    <hr className="my-2" />
                    <Button
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Breadcrumb for mobile */}
            <div className="mb-4 md:hidden">
              <h1 className="text-xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>

            {/* Content */}
            <div className="">{children}</div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarCollapsed && (
        <div
          className="bg-opacity-50 fixed inset-0 z-30 bg-black lg:hidden"
          onClick={() => setSidebarCollapsed(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
