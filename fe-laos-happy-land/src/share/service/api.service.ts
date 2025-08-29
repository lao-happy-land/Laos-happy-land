import { Api } from "@/@types/gentype-axios";

// Tạo instance API với base URL từ environment
const api = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

// Add request interceptor to include auth token
api.instance.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // For FormData requests, don't set Content-Type header
    // Let the browser set it automatically with the correct boundary
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
    // Handle 401 Unauthorized errors (token expired or invalid)
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

        // Redirect to login page if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    const errorMessage =
      error instanceof Error ? error.message : "Response failed";
    return Promise.reject(new Error(errorMessage));
  },
);

export default api.api;
