import api from "./api.service";
import type {
  CreateBankRequestDto,
  UpdateBankRequestStatusDto,
} from "@/@types/gentype-axios";

export interface BankRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  note?: string;
  dob?: string;
  yearsOfExperience?: number;
  bankId?: string;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface BankRequestResponse {
  data: BankRequest[];
  meta: {
    itemCount: number;
    page: number;
    perPage: number;
  };
}

export const bankRequestService = {
  /**
   * Create a bank request
   */
  create: async (data: CreateBankRequestDto) => {
    const response = await api.bankRequestControllerCreate(data);
    return response.data as unknown as BankRequest;
  },

  /**
   * Get all bank requests with pagination (admin)
   */
  getAll: async (params?: {
    page?: number;
    perPage?: number;
    status?: "pending" | "approved" | "rejected";
  }) => {
    const response = await api.bankRequestControllerFindAll(params);
    return response.data as unknown as BankRequestResponse;
  },

  /**
   * Get a bank request by ID
   */
  getById: async (id: string) => {
    const response = await api.bankRequestControllerGet(id);
    return response.data as unknown as BankRequest;
  },

  /**
   * Update bank request (admin)
   */
  update: async (id: string, data: UpdateBankRequestStatusDto) => {
    const response = await api.bankRequestControllerUpdate(id, data);
    return response.data as unknown as BankRequest;
  },

  /**
   * Delete bank request
   */
  delete: async (id: string) => {
    const response = await api.bankRequestControllerRemove(id);
    return response.data as unknown as void;
  },

  /**
   * Approve bank request (admin)
   */
  approve: async (id: string) => {
    const response = await api.bankRequestControllerApprove(id);
    return response.data as unknown as BankRequest;
  },

  /**
   * Reject bank request (admin)
   */
  reject: async (id: string, note?: string) => {
    const response = await api.bankRequestControllerReject(id, { note });
    return response.data as unknown as BankRequest;
  },
};
