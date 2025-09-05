import type { UploadImageResult } from "@/@types/types";
import api from "./api.service";

const uploadService = {
  uploadImage: async (file: File): Promise<UploadImageResult> => {
    const response = await api.imageControllerUploadImage({ image: file });
    return response?.data as unknown as UploadImageResult;
  },
};

export default uploadService;
