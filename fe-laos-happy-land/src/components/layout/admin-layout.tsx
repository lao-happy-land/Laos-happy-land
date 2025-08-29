"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/share/constant/admin-nav-constant";
import { useAuthStore } from "@/share/store/auth.store";
import { LogOut, User, Settings } from "lucide-react";
import { Button, Dropdown, App } from "antd";
import LoadingScreen from "@/components/common/loading-screen";
import UnauthorizedPage from "@/app/unauthorized/page";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { modal } = App.useApp();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitialized, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return (
      <LoadingScreen
        variant="primary"
        message="Đang tải trang..."
        size="lg"
        showProgress
        duration={3}
      />
    );
  }

  if (!isAuthenticated) {
    return <UnauthorizedPage />;
  }

  // Check if user has admin role
  if (user?.role?.toLowerCase() !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-6xl">🚫</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Không có quyền truy cập
          </h1>
          <p className="mb-6 text-gray-600">
            Bạn không có quyền truy cập trang quản trị
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
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
      {/* Sidebar */}
      <aside
        className={`relative z-40 flex h-full flex-col bg-white shadow-lg transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fc746f]">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            )}
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
                    item.active ? "text-white shadow-md" : "hover:bg-gray-100"
                  }`}
                  style={item.active ? { backgroundColor: "#fc746f" } : {}}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {item.active && (
                    <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
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
                    <span
                      className={`text-sm font-medium whitespace-nowrap ${
                        item.active ? "text-white" : "text-gray-700"
                      }`}
                    >
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
              {/* User Dropdown */}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "user-info",
                      disabled: true,
                      className: "border-b border-gray-100 px-4 py-3",
                      label: (
                        <div>
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
                      ),
                    },
                    {
                      key: "profile",
                      icon: <User className="h-4 w-4" />,
                      label: <Link href="/admin/profile">Hồ sơ cá nhân</Link>,
                    },
                    {
                      key: "settings",
                      icon: <Settings className="h-4 w-4" />,
                      label: <Link href="/admin/settings">Cài đặt</Link>,
                    },
                    {
                      type: "divider",
                    },
                    {
                      key: "logout",
                      icon: <LogOut className="h-4 w-4" />,
                      danger: true,
                      label: "Đăng xuất",
                      onClick: () => {
                        modal.confirm({
                          title: "Xác nhận đăng xuất",
                          content: "Bạn có chắc chắn muốn đăng xuất?",
                          okText: "Đăng xuất",
                          cancelText: "Hủy",
                          okType: "danger",
                          onOk: () => {
                            logout();
                          },
                        });
                      },
                    },
                  ],
                }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <Button
                  type="text"
                  size="large"
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                    <span className="text-sm font-medium text-white">
                      {user?.fullName?.charAt(0) ?? "U"}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName ?? "User"}
                    </p>
                  </div>
                  <svg
                    className="h-4 w-4 text-gray-400 transition-transform duration-200"
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
                </Button>
              </Dropdown>
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
    </div>
  );
};

export default AdminLayout;
