import { Api } from "@/@types/gentype-axios";
import { useCurrencyStore } from "../store/currency.store";
import { getLangByLocale, getValidLocale } from "../helper/locale.helper";

// Helper function to get current locale from URL pathname
const getCurrentLocaleFromUrl = (): string => {
  if (typeof window === "undefined") return "la";
  const pathname = window.location.pathname;
  const localeRegex = /^\/(en|vn|la)(\/|$)/;
  const localeMatch = localeRegex.exec(pathname);
  return localeMatch?.[1] ?? "la";
};

// Tạo instance API với base URL từ environment
const api = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

// Add request interceptor to include auth token, currency, and lang
api.instance.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      // Add auth token
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Get locale from URL pathname to ensure it's always in sync with current route
      const localeFromUrl = getCurrentLocaleFromUrl();
      const validLocale = getValidLocale(localeFromUrl);

      config.headers.currency = getLangByLocale(validLocale);

      const priceSource = useCurrencyStore.getState().getCurrency();
      config.headers.priceSource = priceSource;

      config.headers.lang = getLangByLocale(validLocale);
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "Request failed";
    return Promise.reject(new Error(errorMessage));
  },
);

// Add response interceptor to handle token expiration
api.instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "status" in error.response &&
      error.response.status === 401
    ) {
      // Clear the token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        const locale = getCurrentLocaleFromUrl();

        // Redirect to login page if not already there
        window.location.href = `/${locale}/login`;
      }
    }

    // Preserve the original error with all response data
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error);
  },
);

export default api.api;
export { api };
export const apiInstance = api.instance;
