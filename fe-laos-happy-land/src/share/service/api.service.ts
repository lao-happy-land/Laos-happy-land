import { Api } from "@/@types/gentype-axios";
import { useLocaleStore } from "../store/locale.store";
import { useCurrencyStore } from "../store/currency.store";
import { getLangByLocale, getValidLocale } from "../helper/locale.helper";

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

      // Get locale from store
      const locale = useLocaleStore.getState().getLocale();
      const validLocale = getValidLocale(locale);

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

        const locale = useLocaleStore.getState().getLocale();

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
