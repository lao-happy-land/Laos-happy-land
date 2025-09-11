import type { APIResponse, Property } from "@/@types/types";
import type {
  CreatePropertyDto,
  UpdatePropertyDto,
  RejectPropertyDto,
} from "@/@types/gentype-axios";
import api from "./api.service";

const propertyService = {
  getProperties: async (params?: {
    perPage?: number;
    page?: number;
    type?: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
    transaction?: "rent" | "sale" | "project";
    isVerified?: boolean;
  }): Promise<APIResponse<Property[]>> => {
    const response = await api.propertyControllerGetAll(params);
    return response.data as unknown as APIResponse<Property[]>;
  },

  getPropertiesByUser: async (params?: {
    page?: number;
    perPage?: number;
  }): Promise<APIResponse<Property[]>> => {
    const response = await api.propertyControllerGetByUser(params);
    return response.data as unknown as APIResponse<Property[]>;
  },

  getPropertyById: async (id: string): Promise<Property> => {
    const response = await api.propertyControllerGet(id);
    const data = response.data as unknown as {
      property: Property;
      message: string;
    };
    return data.property;
  },

  createProperty: async (data: CreatePropertyDto): Promise<Property> => {
    try {
      const response = await api.propertyControllerCreate(data);
      return response.data as unknown as Property;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  updateProperty: async (
    id: string,
    data: UpdatePropertyDto,
  ): Promise<Property> => {
    const response = await api.propertyControllerUpdate(id, data);
    return response.data as unknown as Property;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.propertyControllerRemove(id);
  },

  approveProperty: async (id: string): Promise<void> => {
    await api.propertyControllerApprove(id);
  },

  rejectProperty: async (
    id: string,
    data: RejectPropertyDto,
  ): Promise<void> => {
    await api.propertyControllerReject(id, data);
  },
};

export default propertyService;
