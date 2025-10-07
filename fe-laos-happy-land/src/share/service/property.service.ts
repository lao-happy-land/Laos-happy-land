import type { APIResponse, Property } from "@/@types/types";
import type {
  CreatePropertyDto,
  UpdatePropertyDto,
  RejectPropertyDto,
} from "@/@types/gentype-axios";
import api from "./api.service";

const propertyService = {
  getProperties: async (query?: {
    page?: number;
    perPage?: number;
    type?: string;
    locationId?: string;
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
    status?: "pending" | "approved" | "rejected";
  }): Promise<APIResponse<Property[]>> => {
    try {
      // Convert type string to array if needed for API compatibility
      const apiQuery = query
        ? {
            ...query,
            type: query.type,
          }
        : undefined;
      const response = await api.propertyControllerGetAll(apiQuery);
      const data = response.data as unknown;

      // Handle different response formats
      if (data && typeof data === "object" && data !== null) {
        // If the response has a data field, use it
        if ("data" in data) {
          return data as APIResponse<Property[]>;
        }

        // If the response is the APIResponse directly
        if ("items" in data || "results" in data) {
          return data as unknown as APIResponse<Property[]>;
        }
      }

      // Fallback to direct casting
      return response.data as unknown as APIResponse<Property[]>;
    } catch (error) {
      console.error("PropertyService: Error fetching properties:", error);
      throw error;
    }
  },

  getPropertiesByUser: async (query?: {
    page?: number;
    perPage?: number;
  }): Promise<APIResponse<Property[]>> => {
    const response = await api.propertyControllerGetByUser(query);
    return response.data as unknown as APIResponse<Property[]>;
  },

  getPropertyById: async (id: string): Promise<Property> => {
    try {
      const response = await api.propertyControllerGet(id);

      const data = response.data as unknown as {
        property: Property;
        message: string;
      };
      return data.property;
    } catch (error) {
      console.error("PropertyService: Error fetching property:", error);
      throw error;
    }
  },

  getPropertyByUserId: async (
    userId: string,
    query?: {
      page?: number;
      perPage?: number;
    },
  ): Promise<APIResponse<Property[]>> => {
    try {
      const response = await api.propertyControllerGetByUserId(userId, query);
      const data = response.data as unknown;

      // Handle different response formats
      if (data && typeof data === "object" && data !== null) {
        // If the response has a data field, use it
        if ("data" in data) {
          return data as APIResponse<Property[]>;
        }
      }

      // Fallback to direct casting
      return response.data as unknown as APIResponse<Property[]>;
    } catch (error) {
      console.error("PropertyService: Error fetching user properties:", error);
      throw error;
    }
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

  getSimilarProperties: async (
    id: string,
    query?: {
      page?: number;
      perPage?: number;
    },
  ): Promise<APIResponse<Property[]>> => {
    try {
      const response = await api.propertyControllerGetSimilarProperties(
        id,
        query,
      );
      const data = response.data as unknown;

      // Handle different response formats
      if (data && typeof data === "object" && data !== null) {
        // If the response has a data field, use it
        if ("data" in data) {
          return data as APIResponse<Property[]>;
        }

        // If the response is the APIResponse directly
        if ("items" in data || "results" in data) {
          return data as unknown as APIResponse<Property[]>;
        }
      }

      // Fallback to direct casting
      return response.data as unknown as APIResponse<Property[]>;
    } catch (error) {
      console.error(
        "PropertyService: Error fetching similar properties:",
        error,
      );
      throw error;
    }
  },
};

export default propertyService;
