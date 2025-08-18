import { Api } from '@/apis/axios-gentype/api-axios';

// Tạo instance API với base URL từ environment
const api = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

export default api;
