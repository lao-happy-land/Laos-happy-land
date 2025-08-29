"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Dropdown,
  Button,
  Avatar,
  Space,
  Drawer,
  Typography,
  Tooltip,
} from "antd";
import {
  Menu as MenuIcon,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  Home,
  Building2,
  FileText,
  BookOpen,
  BarChart3,
  Users,
  LogIn,
  UserPlus,
  Plus,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import type { User } from "@/share/service/auth.service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";

const { Text } = Typography;

const NAV_ITEMS = [
  {
    key: "properties-for-sale",
    title: "Nhà đất bán",
    href: "/properties-for-sale",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "properties-for-rent",
    title: "Nhà đất cho thuê",
    href: "/properties-for-rent",
    icon: <Home className="h-4 w-4" />,
  },
  {
    key: "properties-for-project",
    title: "Dự án",
    href: "/properties-for-project",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "news",
    title: "Tin tức",
    href: "/news",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    key: "wiki",
    title: "Wiki BĐS",
    href: "/wiki",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    key: "analysis",
    title: "Phân tích đánh giá",
    href: "/analysis",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    key: "directory",
    title: "Danh bạ",
    href: "/directory",
    icon: <Users className="h-4 w-4" />,
  },
];

export default function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { user, logout } = useAuthStore();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getSelectedKeys = () => {
    if (pathname === "/") return [];

    const activeItem = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
    return activeItem ? [activeItem.key] : [];
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDisplayName = (user: User | null): string => {
    if (!user) return "User";

    if (user.fullName?.trim() && user.fullName !== "User") {
      return user.fullName;
    }

    if (user.fullName) {
      return user.fullName;
    }

    return "User";
  };

  const displayName = getDisplayName(user);

  const userMenuItems = [
    {
      key: "dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "profile",
      icon: <UserIcon className="h-4 w-4" />,
      label: <Link href="/profile">Thông tin cá nhân</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogOut className="h-4 w-4" />,
      label: "Đăng xuất",
      onClick: logout,
      danger: true,
    },
  ];

  const mobileMenuItems = NAV_ITEMS.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.href ? <Link href={item.href}>{item.title}</Link> : item.title,
  }));

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <header
          className={`bg-white shadow-lg transition-all duration-200 ${
            isScrolled ? "h-[60px]" : "h-[80px]"
          }`}
        >
          <div className="mx-auto flex h-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center">
              <Link
                href="/"
                className="group flex items-center space-x-3 transition-transform duration-200 hover:scale-105"
              >
                <div
                  className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-[#fc746f] to-[#ff8a80] shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                    isScrolled ? "h-8 w-8" : "h-10 w-10"
                  }`}
                >
                  <Building2
                    className={`text-white transition-all duration-300 ${
                      isScrolled ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  />
                </div>
                <div className="hidden sm:block">
                  <div
                    className={`font-bold text-[#fc746f] transition-all duration-300 group-hover:text-[#ff8a80] ${
                      isScrolled ? "text-lg" : "text-xl"
                    }`}
                  >
                    Lào BDS
                  </div>
                  <Text className="text-xs text-gray-500 transition-colors group-hover:text-gray-600">
                    Bất động sản Lào
                  </Text>
                </div>
              </Link>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-center">
              <nav className="flex items-center space-x-1">
                {/* First 3 navigation items */}
                {NAV_ITEMS.slice(0, 3).map((item) => (
                  <div key={item.key}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-orange-50 hover:text-[#fc746f] ${
                          getSelectedKeys().includes(item.key)
                            ? "bg-orange-50 text-[#fc746f]"
                            : "text-gray-500"
                        }`}
                      >
                        <span
                          className={
                            getSelectedKeys().includes(item.key)
                              ? "text-[#fc746f]"
                              : "text-gray-500"
                          }
                        >
                          {item.icon}
                        </span>
                        <span
                          className={`whitespace-nowrap ${
                            getSelectedKeys().includes(item.key)
                              ? "text-[#fc746f]"
                              : "text-gray-600"
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    ) : (
                      <span className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 opacity-60">
                        <span className="text-gray-400">{item.icon}</span>
                        <span className="whitespace-nowrap">{item.title}</span>
                      </span>
                    )}
                  </div>
                ))}

                {/* More menu for remaining items */}
                {NAV_ITEMS.length > 3 && (
                  <Dropdown
                    menu={{
                      items: NAV_ITEMS.slice(3).map((item) => ({
                        key: item.key,
                        icon: item.icon,
                        label: item.href ? (
                          <Link href={item.href}>{item.title}</Link>
                        ) : (
                          <span className="cursor-not-allowed text-gray-400">
                            {item.title}
                          </span>
                        ),
                        disabled: !item.href,
                      })),
                    }}
                    trigger={["click"]}
                    placement="bottom"
                  >
                    <Tooltip placement="right" title="Thêm">
                      <Button type="text">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </Tooltip>
                  </Dropdown>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="lg:hidden">
                <Button
                  type="text"
                  icon={<MenuIcon className="h-5 w-5" />}
                  onClick={() => setDrawerVisible(true)}
                />
              </div>

              <div className="hidden items-center space-x-3 lg:flex">
                {isAuthenticated && user ? (
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      className="flex items-center gap-2 px-3"
                    >
                      <Avatar
                        size="small"
                        className="bg-[#fc746f]"
                        icon={<UserIcon className="h-4 w-4" />}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </Avatar>
                      <span className="hidden max-w-32 truncate md:inline">
                        {displayName}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </Dropdown>
                ) : (
                  <Space>
                    <Button
                      type="text"
                      icon={<LogIn className="h-4 w-4" />}
                      onClick={() => {
                        router.push("/login");
                      }}
                      className="flex items-center gap-1"
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      type="primary"
                      icon={<UserPlus className="h-4 w-4" />}
                      onClick={() => {
                        router.push("/register");
                      }}
                      className="flex items-center gap-1"
                    >
                      Đăng ký
                    </Button>
                  </Space>
                )}

                <Button
                  type="default"
                  icon={<Plus className="h-4 w-4" />}
                  className="flex items-center gap-1"
                  onClick={() => {
                    if (isAuthenticated) {
                      router.push("/create-property");
                    } else {
                      router.push("/login?redirect=/create-property");
                    }
                  }}
                >
                  Đăng tin
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-[#fc746f]" />
            <span className="text-lg font-bold text-[#fc746f]">Lào BDS</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={320}
      >
        <div className="flex flex-col space-y-6">
          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 rounded-lg bg-orange-50 p-4">
                <Avatar
                  size="large"
                  className="bg-[#fc746f]"
                  icon={<UserIcon className="h-5 w-5" />}
                >
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <div className="max-w-48 truncate font-medium">
                    {displayName}
                  </div>
                  <Text className="text-sm text-gray-500">
                    {user.role || "User"}
                  </Text>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="primary"
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  block
                  onClick={() => {
                    setDrawerVisible(false);
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  type="default"
                  icon={<UserIcon className="h-4 w-4" />}
                  block
                  onClick={() => {
                    setDrawerVisible(false);
                    router.push("/profile");
                  }}
                >
                  Thông tin cá nhân
                </Button>
                <Button
                  type="text"
                  danger
                  icon={<LogOut className="h-4 w-4" />}
                  block
                  onClick={() => {
                    setDrawerVisible(false);
                    logout();
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                type="default"
                icon={<LogIn className="h-4 w-4" />}
                block
                onClick={() => {
                  router.push("/login");
                }}
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                icon={<UserPlus className="h-4 w-4" />}
                block
                onClick={() => {
                  router.push("/register");
                }}
              >
                Đăng ký
              </Button>
              <Button
                type="default"
                icon={<Plus className="h-4 w-4" />}
                block
                onClick={() => setDrawerVisible(false)}
              >
                Đăng tin
              </Button>
            </div>
          )}

          <div>
            <Text className="mb-3 block text-sm font-medium text-gray-500">
              Danh mục
            </Text>
            <Menu
              mode="inline"
              className="border-none"
              selectedKeys={getSelectedKeys()}
              items={mobileMenuItems.map((item) => ({
                ...item,
                onClick: () => setDrawerVisible(false),
              }))}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}
