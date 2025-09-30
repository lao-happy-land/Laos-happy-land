/**
 * Locale-based parameter mapping utilities
 * Provides centralized mapping of locale to currency and other locale-specific parameters
 */

export type SupportedLocale = "en" | "vn" | "la";
export type SupportedCurrency = "USD" | "VND" | "LAK";

/**
 * Maps locale to appropriate currency
 */
export const getCurrencyByLocale = (
  locale: SupportedLocale,
): SupportedCurrency => {
  const localeToCurrency: Record<SupportedLocale, SupportedCurrency> = {
    la: "LAK", // Laos - Lao Kip
    en: "USD", // English - US Dollar
    vn: "VND", // Vietnamese - Vietnamese Dong
  };

  return localeToCurrency[locale];
};

/**
 * Gets property service parameters based on locale
 */
export const getPropertyParamsByLocale = (
  locale: SupportedLocale,
  additionalParams: Record<string, string | number | boolean | string[]> = {},
) => {
  return {
    currency: getCurrencyByLocale(locale),
    ...additionalParams,
  };
};

/**
 * Validates if locale is supported
 */
export const isValidLocale = (locale: string): locale is SupportedLocale => {
  return ["en", "vn", "la"].includes(locale);
};

/**
 * Gets default locale if invalid locale is provided
 */
export const getValidLocale = (locale: string): SupportedLocale => {
  return isValidLocale(locale) ? locale : "vn";
};
