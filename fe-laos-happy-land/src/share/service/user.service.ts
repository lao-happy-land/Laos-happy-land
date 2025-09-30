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

  updateProfile: async (id: string, formData: FormData) => {
    try {
      const updateData: UpdateUserDto = {};
      for (const [key, value] of formData.entries()) {
        if (key === "image" && value instanceof File) {
          updateData.image = value;
        } else if (key === "fullName") {
          updateData.fullName = value as string;
        } else if (key === "email") {
          updateData.email = value as string;
        } else if (key === "phone") {
          updateData.phone = value as string;
        } else if (key === "location") {
          // Note: The UpdateUserDto doesn't include location field
          // For now we'll skip it, but in a real scenario we'd need to update the API
          // updateData.location = value as string;
        }
      }

      const response = await api.userControllerUpdate(id, updateData);

      return response.data as unknown as { user: User; message: string };
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  },
};
