import type { APIResponse, PropertyType } from "@/@types/types";
import api from "./api.service";

const propertyTypeService = {
  getPropertyTypes: async () => {
    const response = await api.propertyTypeControllerGetAll();
    return response.data as unknown as APIResponse<PropertyType[]>;
  },
};

export default propertyTypeService;
