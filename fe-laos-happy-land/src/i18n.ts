import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales: string[] = ["en", "vn", "la"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale)) {
    // Use default locale if invalid
    locale = "vn";
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../messages/${locale}.json`)).default,
    locale,
    timeZone: "Asia/Vientiane",
  };
});
