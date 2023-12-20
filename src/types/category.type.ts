import type { UploadFileInfo } from 'naive-ui';
import type { CommonResponse } from './common.type';

enum CategoryType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME'
}

interface Category {
  name: string;
  type: CategoryType;
  imageUrl?: string | null;
}

interface CategoryResponse extends CommonResponse {
  name: string;
  type: string;
  imageUrl: string | null;
  userId: string;
}

interface CategoryRequest {
  name: string;
  type: string;
  image: UploadFileInfo[];
}

export { CategoryType };
export type { Category, CategoryResponse, CategoryRequest };
