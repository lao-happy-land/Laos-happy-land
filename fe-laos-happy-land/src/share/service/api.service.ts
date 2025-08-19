import { Api } from "@/@types/gentype-axios";

// Tạo instance API với base URL từ environment
const api = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

export default api.api;
