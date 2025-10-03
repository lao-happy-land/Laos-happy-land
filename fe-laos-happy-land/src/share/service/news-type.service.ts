import api from "./api.service";
import type { CreateNewsTypeDto } from "@/@types/gentype-axios";
import type { NewsType, NewsTypeResponse } from "@/@types/types";

export const newsTypeService = {
  /**
   * Create a new news type
   */
  createNewsType: async (data: CreateNewsTypeDto) => {
    const response = await api.newsTypeControllerCreateNewsType(data);
    return response.data as unknown as NewsType;
  },

  /**
   * Get all news types with pagination
   */
  getAllNewsTypes: async (params?: {
    page?: number;
    perPage?: number;
    lang?: "VND" | "USD" | "LAK";
  }) => {
    const response = await api.newsTypeControllerGetAll(params);
    return response.data as unknown as NewsTypeResponse;
  },

  /**
   * Get a news type by ID
   */
  getNewsTypeById: async (id: string, lang?: "VND" | "USD" | "LAK") => {
    const response = await api.newsTypeControllerGet(
      id,
      lang ? { lang } : undefined,
    );
    return response.data as unknown as NewsType;
  },

  /**
   * Update a news type by ID
   */
  updateNewsType: async (id: string, data: CreateNewsTypeDto) => {
    const response = await api.newsTypeControllerUpdate(id, data);
    return response.data as unknown as NewsType;
  },

  /**
   * Delete a news type by ID
   */
  deleteNewsType: async (id: string) => {
    const response = await api.newsTypeControllerRemove(id);
    return response.data as unknown as void;
  },
};
