import type { RequestParams } from "@/@types/gentype-axios";
import api from "./api.service";
import type { APIResponse } from "@/@types/types";

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

export interface CreateSettingDto {
  description?: string;
  hotline?: string;
  facebook?: string;
  images?: string[];
  banner?: string;
}

export interface GetSettingParams {
  page?: number;
  perPage?: number;
}

export interface SettingResponse {
  data: Setting[];
  meta: {
    page: number;
    itemCount: number;
    pageCount: number;
    take: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface SingleSettingResponse {
  setting: Setting;
  message: string;
}

class SettingService {
  async getAllSettings(
    params: GetSettingParams = {},
  ): Promise<SettingResponse> {
    const { page = 1, perPage = 10 } = params;
    const response = await api.settingControllerGetAll(
      {
        page,
        perPage,
      },
      {},
    );
    return response.data as unknown as APIResponse<Setting[]>;
  }

  async getSetting(id: string): Promise<SingleSettingResponse> {
    const response = await api.settingControllerGet(id);
    return response.data as unknown as SingleSettingResponse;
  }

  async createSetting(data: CreateSettingDto): Promise<SingleSettingResponse> {
    const response = await api.settingControllerCreate(data);
    return response.data as unknown as SingleSettingResponse;
  }

  async updateSetting(
    id: string,
    data: CreateSettingDto,
  ): Promise<SingleSettingResponse> {
    const response = await api.settingControllerUpdate(id, data);
    return response.data as unknown as SingleSettingResponse;
  }

  async deleteSetting(id: string): Promise<{ message: string }> {
    const response = await api.settingControllerRemove(id);
    return response.data as unknown as { message: string };
  }
}

export const settingService = new SettingService();
