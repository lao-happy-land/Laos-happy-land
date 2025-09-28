import api from "./api.service";
import type { CreateUserFeedbackDto } from "@/@types/gentype-axios";
import type { APIResponse, UserFeedback } from "@/@types/types";

export const userFeedbackService = {
  createFeedback: async (data: CreateUserFeedbackDto): Promise<void> => {
    await api.userFeedbackControllerCreate(data);
  },

  getFeedbackByUserId: async (
    userId: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<APIResponse<UserFeedback[]>> => {
    const response = await api.userFeedbackControllerGetByUserId(userId, params);
    return response.data as unknown as APIResponse<UserFeedback[]>;
  },
};
