import type { CreateSettingDto } from "@/@types/gentype-axios";
import api from "./api.service";

export interface Setting {
  id: string;
  description?: string;
  hotline?: string;
  facebook?: string;
  images?: string[];
  banner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SingleSettingResponse {
  setting: Setting;
  message: string;
}

class SettingService {
  async getSetting(): Promise<Setting> {
    try {
      const response = await api.settingControllerGet();
      const data = response.data as unknown;

      // Handle response format
      if (data && typeof data === "object" && data !== null) {
        // If response has a setting field
        if ("setting" in data) {
          return (data as { setting: Setting }).setting;
        }
        // If response is the setting directly
        return data as Setting;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error fetching setting:", error);
      throw error;
    }
  }

  async updateSetting(data: CreateSettingDto): Promise<Setting> {
    try {
      const response = await api.settingControllerUpdate(data);
      const responseData = response.data as unknown;

      // Handle response format
      if (
        responseData &&
        typeof responseData === "object" &&
        responseData !== null
      ) {
        // If response has a setting field
        if ("setting" in responseData) {
          return (responseData as { setting: Setting }).setting;
        }
        // If response is the setting directly
        return responseData as Setting;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error updating setting:", error);
      throw error;
    }
  }
}

export const settingService = new SettingService();
