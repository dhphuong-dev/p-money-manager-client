import { api } from '@axios';
import type { APIResponse } from '@/types/response.type';
import type { CategoryResponse, CategoryRequest } from '@/types/category.type';
import { UrlConstants } from '@/constants';

const category = () => ({
  async getMyCategories() {
    return api.get<APIResponse<CategoryResponse[]>>(UrlConstants.CATEGORY + '/me');
  },
  async getCategoryById(id: string) {
    return api.get<APIResponse<CategoryResponse>>(UrlConstants.CATEGORY, { params: { id } });
  },
  async createNewCategory(category: CategoryRequest) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const formData = new FormData();
    formData.append('type', category.type);
    formData.append('name', category.name);
    category.image.length > 0 && formData.append('image', category.image[0].file as File);

    return api.post<APIResponse<CategoryResponse>>(UrlConstants.CATEGORY, formData, config);
  }
});

export const { createNewCategory, getMyCategories, getCategoryById } = category();
