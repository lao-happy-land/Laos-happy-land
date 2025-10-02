import api from "./api.service";
import type { CreateUserDto, UpdateUserDto } from "@/@types/gentype-axios";
import type { APIResponse, User, UserRole } from "@/@types/types";

export const userService = {
  createUser: async (data: CreateUserDto): Promise<CreateUserDto> => {
    const response = await api.userControllerCreate(data);
    return response.data as unknown as CreateUserDto;
  },

  getAllUsers: async (params?: {
    search?: string;
    role?: string;
    page?: number;
    perPage?: number;
  }): Promise<APIResponse<User[]>> => {
    const response = await api.userControllerGetAll(params);
    return response.data as unknown as APIResponse<User[]>;
  },

  getUserById: async (id: string): Promise<{ user: User; message: string }> => {
    const response = await api.userControllerGet(id);
    return response.data as unknown as { user: User; message: string };
  },

  updateUser: async (
    id: string,
    data: UpdateUserDto,
  ): Promise<UpdateUserDto> => {
    // Create a new object without the email field to prevent editing
    const updateData: UpdateUserDto = {
      fullName: data.fullName,
      phone: data.phone,
      roleId: data.roleId,
      password: data.password,
      image: data.image,
    };

    const response = await api.userControllerUpdate(id, updateData);
    return response.data as unknown as UpdateUserDto;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.userControllerRemove(id);
  },

  getAllUserRoles: async () => {
    const response = await api.userRoleControllerGetAll();
    return response.data as unknown as UserRole[];
  },

  updateProfile: async (id: string, updateData: UpdateUserDto) => {
    try {
      const response = await api.userControllerUpdate(id, updateData);

      return response.data as unknown as { user: User; message: string };
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  },

  requestIsFromBank: async (
    id: string,
    data: {
      note: string;
      phone: string;
      image: File;
    },
  ): Promise<void> => {
    try {
      await api.userControllerRequestIsFromBank(id, data);
    } catch (error) {
      console.error("Bank request error:", error);
      throw error;
    }
  },

  requestRoleUpgrade: async (
    id: string,
    data: {
      note?: string | null;
    },
  ): Promise<void> => {
    try {
      await api.userControllerRequestRoleUpgrade(id, data);
    } catch (error) {
      console.error("Role upgrade request error:", error);
      throw error;
    }
  },

  getBankRequests: async (params?: {
    page?: number;
    perPage?: number;
    search?: string;
    requestedRoleUpgrade?: boolean;
  }): Promise<APIResponse<User[]>> => {
    const response = await api.userControllerGetBankRequests(params);
    return response.data as unknown as APIResponse<User[]>;
  },

  approveIsFromBank: async (id: string, approve: boolean): Promise<void> => {
    await api.userControllerApproveIsFromBank(id, { approve });
  },

  approveRoleUpgrade: async (id: string, approve: boolean): Promise<void> => {
    await api.userControllerApproveRoleUpgrade(id, { approve });
  },

  getRandomBankUsers: async (): Promise<User[]> => {
    try {
      const response = await api.userControllerGetRandomUser();
      const data = response.data as unknown;

      // Handle different response formats
      if (data && typeof data === "object" && data !== null) {
        // If the response has a users field
        if (
          "users" in data &&
          Array.isArray((data as { users: unknown }).users)
        ) {
          return (data as { users: User[] }).users;
        }

        // If the response has a data field
        if ("data" in data && Array.isArray((data as { data: unknown }).data)) {
          return (data as { data: User[] }).data;
        }

        // If the response is a direct array
        if (Array.isArray(data)) {
          return data as User[];
        }
      }

      // Fallback to empty array if structure is unexpected
      console.warn("Unexpected response format for random bank users:", data);
      return [];
    } catch (error) {
      console.error("Error fetching random bank users:", error);
      return [];
    }
  },
};
