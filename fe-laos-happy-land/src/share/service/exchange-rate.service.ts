import api from "@/share/service/api.service";
import type {
  CreateExchangeRateDto,
  UpdateExchangeRateDto,
} from "@/@types/gentype-axios";

export interface ExchangeRate {
  id: string;
  currency: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeRateResponse {
  data: ExchangeRate[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  message: string;
}

export interface SingleExchangeRateResponse {
  data: ExchangeRate;
  message: string;
}

class ExchangeRateService {
  async getAllExchangeRates(params?: {
    page?: number;
    perPage?: number;
  }): Promise<ExchangeRateResponse> {
    try {
      const response = await api.exchangeRateControllerGetAll(params);
      return response.data as unknown as ExchangeRateResponse;
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      throw error;
    }
  }

  async getExchangeRateById(id: string): Promise<SingleExchangeRateResponse> {
    try {
      const response = await api.exchangeRateControllerGet(id);
      return response.data as unknown as SingleExchangeRateResponse;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      throw error;
    }
  }

  async createExchangeRate(
    data: CreateExchangeRateDto,
  ): Promise<SingleExchangeRateResponse> {
    try {
      const response = await api.exchangeRateControllerCreate(data);
      return response.data as unknown as SingleExchangeRateResponse;
    } catch (error) {
      console.error("Error creating exchange rate:", error);
      throw error;
    }
  }

  async updateExchangeRate(
    id: string,
    data: UpdateExchangeRateDto,
  ): Promise<SingleExchangeRateResponse> {
    try {
      const response = await api.exchangeRateControllerUpdate(id, data);
      return response.data as unknown as SingleExchangeRateResponse;
    } catch (error) {
      console.error("Error updating exchange rate:", error);
      throw error;
    }
  }

  async deleteExchangeRate(id: string): Promise<void> {
    try {
      await api.exchangeRateControllerRemove(id);
    } catch (error) {
      console.error("Error deleting exchange rate:", error);
      throw error;
    }
  }
}

const exchangeRateService = new ExchangeRateService();
export default exchangeRateService;
