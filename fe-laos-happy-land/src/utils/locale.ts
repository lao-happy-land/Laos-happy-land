import { usePathname } from "next/navigation";

export function useUrlLocale() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  // Validate if it's a valid locale
  const validLocales = ["en", "vn", "la"];
  if (locale && validLocales.includes(locale)) {
    return locale;
  }

  // Fallback to default
  return "vn";
}
