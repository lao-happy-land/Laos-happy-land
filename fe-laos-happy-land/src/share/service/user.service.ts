import api from "./api.service";
import type { CreateUserDto, UpdateUserDto } from "@/@types/gentype-axios";
import type { UserRole } from "@/@types/types";

export const userService = {
  createUser: async (data: CreateUserDto): Promise<CreateUserDto> => {
    const response = await api.userControllerCreate(data);
    return response.data as unknown as CreateUserDto;
  },

  getAllUsers: async (params?: {
    fullName?: string;
    email?: string;
    phone?: string;
    role?: string;
    avatarUrl?: string;
    take?: number;
    skip?: number;
  }) => {
    const response = await api.userControllerGetAll(params);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.userControllerGet(id);
    return response.data;
  },

  updateUser: async (
    id: string,
    data: UpdateUserDto,
  ): Promise<UpdateUserDto> => {
    const formData = new FormData();
    if (data.fullName) formData.append("fullName", data.fullName);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.roleId) formData.append("roleId", data.roleId);
    const response = await api.userControllerUpdate(id, formData);
    return response.data as unknown as UpdateUserDto;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.userControllerRemove(id);
  },

  getAllUserRoles: async () => {
    const response = await api.userRoleControllerGetAll();
    return response.data as unknown as UserRole[];
  },
};
