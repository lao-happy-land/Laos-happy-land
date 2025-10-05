/**
 * Locale-based parameter mapping utilities
 * Provides centralized mapping of locale to currency and other locale-specific parameters
 */

export type SupportedLocale = "en" | "vn" | "la";
export type SupportedCurrency = "USD" | "LAK" | "THB";

/**
 * Maps locale to currency for display formatting purposes only
 * @deprecated Use useCurrencyStore instead for price currency
 * Note: This is kept for backward compatibility with display formatting
 */
export const getCurrencyByLocale = (
  locale: SupportedLocale,
): SupportedCurrency => {
  const localeToCurrency: Record<SupportedLocale, SupportedCurrency> = {
    la: "LAK", // Laos - Lao Kip
    en: "USD", // English - US Dollar
    vn: "THB", // Vietnamese - Thai Baht
  };

  return localeToCurrency[locale];
};

/**
 * Maps locale to appropriate language parameter for API calls
 * This is used for both 'currency' and 'lang' headers for language display
 * (USD=EN, LAK=LO, VND=VI)
 */
export const getLangByLocale = (
  locale: SupportedLocale,
): "VND" | "USD" | "LAK" => {
  const localeToLang: Record<SupportedLocale, "VND" | "USD" | "LAK"> = {
    la: "LAK", // Laos - Lao language
    en: "USD", // English - English language
    vn: "VND", // Vietnamese - Vietnamese language
  };

  return localeToLang[locale];
};

/**
 * Gets property service parameters based on locale
 * Note: Currency is now handled via priceSource header, not as a parameter
 */
export const getPropertyParamsByLocale = (
  locale: SupportedLocale,
  additionalParams: Record<string, string | number | boolean | string[]> = {},
) => {
  return {
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
