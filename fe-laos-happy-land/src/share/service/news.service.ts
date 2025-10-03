import api from "./api.service";
import type { CreateNewsDto } from "@/@types/gentype-axios";
import type { News, NewsResponse } from "@/@types/types";

export const newsService = {
  /**
   * Create a new news
   */
  createNews: async (data: CreateNewsDto) => {
    const response = await api.newsControllerCreate(data);
    return response.data as unknown as News;
  },

  /**
   * Get all news with pagination and filters
   */
  getAllNews: async (params?: {
    page?: number;
    perPage?: number;
    newsTypeId?: string;
    search?: string;
    lang?: "VND" | "USD" | "LAK";
  }) => {
    const response = await api.newsControllerGetAll(params);
    return response.data as unknown as NewsResponse;
  },

  /**
   * Get a news by ID
   */
  getNewsById: async (id: string, lang?: "VND" | "USD" | "LAK") => {
    const response = await api.newsControllerGet(
      id,
      lang ? { lang } : undefined,
    );
    const data = response.data as unknown as { news: News; message: string };
    return data.news;
  },

  /**
   * Update a news by ID
   */
  updateNews: async (id: string, data: CreateNewsDto) => {
    const response = await api.newsControllerUpdate(id, data);
    return response.data as unknown as News;
  },

  /**
   * Delete a news by ID
   */
  deleteNews: async (id: string) => {
    const response = await api.newsControllerRemove(id);
    return response.data as unknown as void;
  },
};
