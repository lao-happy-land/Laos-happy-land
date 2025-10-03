import type { APIResponse, PropertyType } from "@/@types/types";
import api from "./api.service";

const propertyTypeService = {
  getPropertyTypes: async (query?: {
    transaction?: "rent" | "sale" | "project" | undefined;
    search?: string;
    page?: number;
    perPage?: number;
    lang?: "VND" | "USD" | "LAK";
  }) => {
    // Filter out empty parameters
    const filteredQuery: Record<string, string | number> = {};

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          filteredQuery[key] = value;
        }
      });
    }

    const response = await api.propertyTypeControllerGetAll(
      Object.keys(filteredQuery).length > 0 ? filteredQuery : undefined,
    );
    return response.data as unknown as APIResponse<PropertyType[]>;
  },

  getPropertyTypeById: async (id: string, lang?: "VND" | "USD" | "LAK") => {
    const response = await api.propertyTypeControllerGet(
      id,
      lang ? { lang } : undefined,
    );
    return response.data as unknown as APIResponse<PropertyType>;
  },

  createPropertyType: async (data: {
    name: string;
    transactionType: "rent" | "sale" | "project";
  }) => {
    const response = await api.propertyTypeControllerCreate(data);
    return response.data as unknown as APIResponse<PropertyType>;
  },

  updatePropertyType: async (
    id: string,
    data: {
      name: string;
      transactionType: "rent" | "sale" | "project";
    },
  ) => {
    const response = await api.propertyTypeControllerUpdate(id, data);
    return response.data as unknown as APIResponse<PropertyType>;
  },

  deletePropertyType: async (id: string) => {
    const response = await api.propertyTypeControllerRemove(id);
    return response.data as unknown as APIResponse<void>;
  },
};

export default propertyTypeService;
