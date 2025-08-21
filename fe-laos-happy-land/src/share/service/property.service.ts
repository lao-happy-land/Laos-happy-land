import type { APIResponse, Property } from "@/@types/types";
import api from "./api.service";

const propertyService = {
  getProperties: async (params?: {
    type?: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
    transaction?: "rent" | "sale";
    isVerified?: boolean;
  }): Promise<APIResponse<Property[]>> => {
    const response = await api.propertyControllerGetAll(params);
    return response.data as unknown as APIResponse<Property[]>;
  },
};

export default propertyService;
