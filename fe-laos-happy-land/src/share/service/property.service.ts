import api from './api.service';
import type { CreatePropertyDto, UpdatePropertyDto } from '@/apis/axios-gentype/api-axios';

export interface Property {
  id: string;
  type: string;
  user_id: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface PropertySearchQuery {
  type?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  isVerified?: boolean;
  take?: number;
  skip?: number;
}

export interface PropertyListResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePropertyRequest extends Omit<CreatePropertyDto, 'user_id'> {
  user_id?: string;
}

export type UpdatePropertyRequest = UpdatePropertyDto;

export const propertyService = {
  async create(data: CreatePropertyRequest): Promise<Property> {
    try {
      const response = await api.api.propertyControllerCreate(data as CreatePropertyDto);
      return response.data as unknown as Property;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string; statusCode?: number } } };
        if (axiosError.response?.data) {
          const apiError = new Error(axiosError.response.data.message ?? 'Tạo tin đăng thất bại');
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  async getAll(query?: PropertySearchQuery): Promise<PropertyListResponse> {
    try {
      const response = await api.api.propertyControllerGetAll(query);
      return response.data as unknown as PropertyListResponse;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string; statusCode?: number } } };
        if (axiosError.response?.data) {
          const apiError = new Error(axiosError.response.data.message ?? 'Lấy danh sách tin đăng thất bại');
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  async getById(id: string): Promise<Property> {
    try {
      const response = await api.api.propertyControllerGet(id);
      return response.data as unknown as Property;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string; statusCode?: number } } };
        if (axiosError.response?.data) {
          const apiError = new Error(axiosError.response.data.message ?? 'Lấy thông tin tin đăng thất bại');
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  async update(id: string, data: UpdatePropertyRequest): Promise<Property> {
    try {
      const response = await api.api.propertyControllerUpdate(id, data);
      return response.data as unknown as Property;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string; statusCode?: number } } };
        if (axiosError.response?.data) {
          const apiError = new Error(axiosError.response.data.message ?? 'Cập nhật tin đăng thất bại');
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.api.propertyControllerRemove(id);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string; statusCode?: number } } };
        if (axiosError.response?.data) {
          const apiError = new Error(axiosError.response.data.message ?? 'Xóa tin đăng thất bại');
          Object.assign(apiError, { response: axiosError.response });
          throw apiError;
        }
      }
      throw error;
    }
  },

  // Utility methods
  formatPrice(price?: number): string {
    if (!price) return 'Thỏa thuận';
    
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1)} tỷ`;
    } else if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(0)} triệu`;
    } else {
      return `${price.toLocaleString('vi-VN')} VND`;
    }
  },

  formatArea(area?: number): string {
    if (!area) return 'Chưa xác định';
    return `${area} m²`;
  },

  getPropertyTypeLabel(type: string): string {
    const typeLabels: Record<string, string> = {
      'apartment': 'Căn hộ/Chung cư',
      'house': 'Nhà riêng',
      'villa': 'Biệt thự',
      'townhouse': 'Nhà phố',
      'land': 'Đất nền',
      'office': 'Văn phòng',
      'shop': 'Cửa hàng/Ki ốt',
      'warehouse': 'Nhà kho',
      'other': 'Khác'
    };
    
    return typeLabels[type] ?? type;
  },

  validatePropertyData(data: CreatePropertyRequest | UpdatePropertyRequest): string[] {
    const errors: string[] = [];
    
    if ('title' in data && !data.title?.trim()) {
      errors.push('Tiêu đề không được để trống');
    }
    
    if ('type' in data && !data.type?.trim()) {
      errors.push('Loại bất động sản không được để trống');
    }
    
    if ('price' in data && data.price !== undefined && data.price < 0) {
      errors.push('Giá không được âm');
    }
    
    if ('area' in data && data.area !== undefined && data.area <= 0) {
      errors.push('Diện tích phải lớn hơn 0');
    }
    
    if ('bedrooms' in data && data.bedrooms !== undefined && data.bedrooms < 0) {
      errors.push('Số phòng ngủ không được âm');
    }
    
    if ('bathrooms' in data && data.bathrooms !== undefined && data.bathrooms < 0) {
      errors.push('Số phòng tắm không được âm');
    }
    
    return errors;
  }
};

export default propertyService;
