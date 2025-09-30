"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button, Dropdown } from "antd";
import { Globe } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocaleStore } from "@/share/store/locale.store";

const languages = [
  { code: "vn", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "la", name: "ລາວ", flag: "🇱🇦" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { setLocale } = useLocaleStore();

  // Get current locale from URL pathname only - no store dependency
  const currentLocale = useMemo(() => {
    const pathSegments = pathname.split("/");
    const urlLocale = pathSegments[1]; // First segment after /

    // Validate if it's a valid locale
    if (urlLocale && languages.some((lang) => lang.code === urlLocale)) {
      return urlLocale;
    }

    // Fallback to default
    return "vn";
  }, [pathname]);

  const currentLanguage = languages.find((lang) => lang.code === currentLocale);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    setLoading(true);

    // Store user's locale preference in Zustand store
    setLocale(newLocale);

    // Also set a cookie for server-side access
    document.cookie = `locale-preference=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

    // Construct new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // Use router.push to ensure proper re-rendering
    router.push(newPath);

    // Reset loading state after navigation
    setTimeout(() => setLoading(false), 500);
  };

  const menuItems = languages.map((lang) => ({
    key: lang.code,
    label: (
      <div className="flex items-center gap-2 px-2 py-1">
        <span className="text-lg">{lang.flag}</span>
        <span className="font-medium">{lang.name}</span>
        {lang.code === currentLocale && (
          <span className="ml-auto text-blue-500">✓</span>
        )}
      </div>
    ),
    onClick: () => handleLanguageChange(lang.code),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={["click"]}
      disabled={loading}
    >
      <Button
        type="text"
        icon={<Globe size={16} />}
        loading={loading}
        className="flex items-center gap-2 border-0 shadow-none hover:bg-gray-50"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
      </Button>
    </Dropdown>
  );
}
