import type { APIResponse } from "@/@types/types";
import type { CreateBankDto, UpdateBankDto } from "@/@types/gentype-axios";
import api from "./api.service";

export interface TermRate {
  term: string;
  interestRate: number;
}

export interface Bank {
  id: string;
  name: string;
  termRates: TermRate[];
  createdAt: string;
  updatedAt: string;
}

const bankService = {
  getBanks: async (query?: {
    page?: number;
    perPage?: number;
    search?: string;
  }): Promise<APIResponse<Bank[]>> => {
    try {
      const response = await api.bankControllerGetAll(query);
      const data = response.data as unknown as APIResponse<Bank[]>;

      // Handle different response formats
      if (data && typeof data === "object" && data !== null) {
        // If the response has a data field, use it
        if ("data" in data) {
          return data;
        }

        // If the response is the APIResponse directly
        if ("items" in data || "results" in data) {
          return data;
        }
      }

      // Fallback to direct casting
      return data;
    } catch (error: unknown) {
      console.error("BankService: Error fetching banks:", error);
      throw error;
    }
  },

  getBankById: async (id: string): Promise<Bank> => {
    try {
      const response = await api.bankControllerGet(id);

      const data = response.data as unknown as {
        bank: Bank;
        message: string;
      };
      return data.bank;
    } catch (error: unknown) {
      console.error("BankService: Error fetching bank:", error);
      throw error;
    }
  },

  createBank: async (data: CreateBankDto): Promise<Bank> => {
    try {
      const response = await api.bankControllerCreateBank(data);
      return response.data as unknown as Bank;
    } catch (error: unknown) {
      console.error("BankService: Error creating bank:", error);
      throw error;
    }
  },

  updateBank: async (id: string, data: UpdateBankDto): Promise<Bank> => {
    try {
      const response = await api.bankControllerUpdate(id, data);
      return response.data as unknown as Bank;
    } catch (error: unknown) {
      console.error("BankService: Error updating bank:", error);
      throw error;
    }
  },

  deleteBank: async (id: string): Promise<void> => {
    try {
      await api.bankControllerRemove(id);
    } catch (error: unknown) {
      console.error("BankService: Error deleting bank:", error);
      throw error;
    }
  },
};

export default bankService;
