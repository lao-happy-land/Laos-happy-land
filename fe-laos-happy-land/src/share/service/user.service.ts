import type { CreateUserDto, UpdateUserDto } from "@/@types/gentype-axios";
import type { APIResponse, User, UserRole } from "@/@types/types";
import api from "./api.service";

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
      password: data.password ?? "",
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

  getRoleUpgradeRequests: async (params?: {
    page?: number;
    perPage?: number;
    search?: string;
  }): Promise<APIResponse<User[]>> => {
    const response = await api.userControllerGetAll({
      ...params,
      requestedRoleUpgrade: true,
    });
    return response.data as unknown as APIResponse<User[]>;
  },

  approveRoleUpgrade: async (id: string, approve: boolean): Promise<void> => {
    await api.userControllerApproveRoleUpgrade(id, { approve });
  },
};
