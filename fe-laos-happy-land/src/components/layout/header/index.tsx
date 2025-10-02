"use client";

import { useState } from "react";
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
  Users,
  LogIn,
  UserPlus,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Calculator,
} from "lucide-react";
import type { User } from "@/share/service/auth.service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";
import Image from "next/image";
import LanguageSwitcher from "@/components/business/common/language-switcher";
import { useUrlLocale } from "@/utils/locale";
import { useTranslations } from "next-intl";
const { Text } = Typography;

const getNavItems = (locale: string, t: (key: string) => string) => [
  {
    key: "properties-for-sale",
    title: t("navigation.propertiesForSale"),
    href: `/${locale}/properties-for-sale`,
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "properties-for-rent",
    title: t("navigation.propertiesForRent"),
    href: `/${locale}/properties-for-rent`,
    icon: <Home className="h-4 w-4" />,
  },
  {
    key: "properties-for-project",
    title: t("navigation.projects"),
    href: `/${locale}/properties-for-project`,
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "news",
    title: t("navigation.news"),
    href: `/${locale}/news`,
    icon: <FileText className="h-4 w-4" />,
  },
  // {
  //   key: "analysis",
  //   title: t("navigation.analysis"),
  //   href: `/${locale}/analysis`,
  //   icon: <BarChart3 className="h-4 w-4" />,
  // },
  {
    key: "directory",
    title: t("navigation.directory"),
    href: `/${locale}/brokers`,
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: "loan-calculator",
    title: t("navigation.loanCalculator"),
    href: `/${locale}/loan-calculator`,
    icon: <Calculator className="h-4 w-4" />,
  },
];

export default function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { user, logout } = useAuthStore();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useUrlLocale();
  const t = useTranslations();

  const NAV_ITEMS = getNavItems(locale, t);

  const getSelectedKeys = () => {
    if (pathname === "/") return [];

    const activeItem = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
    return activeItem ? [activeItem.key] : [];
  };

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
      label: (
        <Link href={`/${locale}/dashboard`}>{t("navigation.dashboard")}</Link>
      ),
    },
    {
      key: "profile",
      icon: <UserIcon className="h-4 w-4" />,
      label: (
        <Link href={`/${locale}/profile`}>{t("navigation.personalInfo")}</Link>
      ),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogOut className="h-4 w-4" />,
      label: t("navigation.logout"),
      onClick: () => logout(),
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
          className={`h-[80px] border-b border-neutral-200 bg-white transition-all duration-200`}
        >
          <div className="mx-auto flex h-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center">
              <Link
                href={`/${locale}`}
                className="group flex items-center space-x-3 transition-transform duration-200 hover:scale-105"
              >
                <div className={`flex items-center ${"h-12 w-12"}`}>
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={100}
                    height={100}
                  />
                </div>
                <div>
                  <h1 className="text-primary-500 text-lg font-bold">
                    Laohappyland
                  </h1>
                  <p className="text-xs text-neutral-600">
                    No.1 property platform
                  </p>
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
                        className={`hover:bg-primary-50 hover:text-primary-500 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          getSelectedKeys().includes(item.key)
                            ? "bg-primary-50 text-primary-500"
                            : "text-neutral-600"
                        }`}
                      >
                        <span
                          className={
                            getSelectedKeys().includes(item.key)
                              ? "text-primary-500"
                              : "text-neutral-500"
                          }
                        >
                          {item.icon}
                        </span>
                        <span
                          className={`whitespace-nowrap ${
                            getSelectedKeys().includes(item.key)
                              ? "text-primary-500"
                              : "text-neutral-600"
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    ) : (
                      <span className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 opacity-60">
                        <span className="text-neutral-400">{item.icon}</span>
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
                          <span className="cursor-not-allowed text-neutral-400">
                            {item.title}
                          </span>
                        ),
                        disabled: !item.href,
                      })),
                    }}
                    trigger={["click"]}
                    placement="bottom"
                  >
                    <Tooltip placement="right" title={t("navigation.more")}>
                      <Button type="text">
                        <MoreHorizontal className="h-4 w-4 text-neutral-500" />
                      </Button>
                    </Tooltip>
                  </Dropdown>
                )}
              </nav>
            </div>

            <div className="flex items-center">
              <div className="xl:hidden">
                <Button
                  type="text"
                  icon={<MenuIcon className="h-5 w-5" />}
                  onClick={() => setDrawerVisible(true)}
                />
              </div>

              <div className="hidden items-center space-x-3 xl:flex">
                <LanguageSwitcher />
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
                        className="bg-primary-500"
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
                        router.push(`/${locale}/login`);
                      }}
                      className="flex items-center gap-1"
                    >
                      {t("navigation.login")}
                    </Button>
                    <Button
                      type="primary"
                      icon={<UserPlus className="h-4 w-4" />}
                      onClick={() => {
                        router.push(`/${locale}/register`);
                      }}
                      className="flex items-center gap-1"
                    >
                      {t("navigation.register")}
                    </Button>
                  </Space>
                )}

                <Button
                  type="default"
                  icon={<Plus className="h-4 w-4" />}
                  className="flex items-center gap-1"
                  onClick={() => {
                    if (isAuthenticated) {
                      router.push(`/${locale}/create-property`);
                    } else {
                      router.push(
                        `/${locale}/login?redirect=/${locale}/create-property`,
                      );
                    }
                  }}
                >
                  {t("navigation.postAd")}
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-orange-600" />
            <span className="text-lg font-bold text-orange-600">Lào BDS</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={320}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 rounded-lg bg-orange-50 p-4">
                <Avatar
                  size="large"
                  className="bg-orange-600"
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
                    router.push(`/${locale}/dashboard`);
                  }}
                >
                  {t("navigation.dashboard")}
                </Button>
                <Button
                  type="default"
                  icon={<UserIcon className="h-4 w-4" />}
                  block
                  onClick={() => {
                    setDrawerVisible(false);
                    router.push(`/${locale}/profile`);
                  }}
                >
                  {t("navigation.personalInfo")}
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
                  {t("navigation.logout")}
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
                  router.push(`/${locale}/login`);
                }}
              >
                {t("navigation.login")}
              </Button>
              <Button
                type="primary"
                icon={<UserPlus className="h-4 w-4" />}
                block
                onClick={() => {
                  router.push(`/${locale}/register`);
                }}
              >
                {t("navigation.register")}
              </Button>
              <Button
                type="default"
                icon={<Plus className="h-4 w-4" />}
                block
                onClick={() => setDrawerVisible(false)}
              >
                {t("navigation.postAd")}
              </Button>
            </div>
          )}

          <div>
            <Text className="mb-3 block text-sm font-medium text-gray-500">
              {t("navigation.categories")}
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
