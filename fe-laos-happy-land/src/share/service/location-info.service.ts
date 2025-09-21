import api from "@/share/service/api.service";
import type { CreateLocationInfoDto } from "@/@types/gentype-axios";
import type { APIResponse } from "@/@types/types";

export interface LocationInfo {
  id: string;
  name: string;
  imageURL?: string;
  strict?: string[];
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

class LocationInfoService {
  /**
   * Get all location info
   */
  async getAllLocationInfo(): Promise<APIResponse<LocationInfo[]>> {
    try {
      const response = await api.locationInfoControllerGetAll();

      return response.data as unknown as APIResponse<LocationInfo[]>;
    } catch (error) {
      console.error("Error fetching location info:", error);
      throw error;
    }
  }

  /**
   * Get trending locations
   */
  async getTrendingLocations(): Promise<APIResponse<LocationInfo[]>> {
    try {
      const response = await api.locationInfoControllerGetTrendingLocations();

      return response.data as unknown as APIResponse<LocationInfo[]>;
    } catch (error) {
      console.error("Error fetching trending locations:", error);
      throw error;
    }
  }

  /**
   * Get location info by ID
   */
  async getLocationInfoById(id: string): Promise<LocationInfo> {
    try {
      const response = await api.locationInfoControllerGet(id);
      return response.data as unknown as LocationInfo;
    } catch (error) {
      console.error("Error fetching location info by ID:", error);
      throw error;
    }
  }

  /**
   * Create new location info
   */
  async createLocationInfo(data: CreateLocationInfoDto): Promise<LocationInfo> {
    try {
      const response = await api.locationInfoControllerCreate(data);
      return response.data as unknown as LocationInfo;
    } catch (error) {
      console.error("Error creating location info:", error);
      throw error;
    }
  }

  /**
   * Update location info
   */
  async updateLocationInfo(
    id: string,
    data: CreateLocationInfoDto,
  ): Promise<LocationInfo> {
    try {
      const response = await api.locationInfoControllerUpdate(id, data);
      return response.data as unknown as LocationInfo;
    } catch (error) {
      console.error("Error updating location info:", error);
      throw error;
    }
  }

  /**
   * Delete location info
   */
  async deleteLocationInfo(id: string): Promise<void> {
    try {
      await api.locationInfoControllerRemove(id);
    } catch (error) {
      console.error("Error deleting location info:", error);
      throw error;
    }
  }
}

const locationInfoService = new LocationInfoService();
export default locationInfoService;
