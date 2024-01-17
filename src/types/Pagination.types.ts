interface PageMeta {
  totalElements: number;
  totalPages: number;
  pageNum: number;
  pageSize: number;
  sortBy: string;
  sortType: string;
}

interface PaginationRequest<T> {
  pageNum?: number;
  pageSize?: number;
  sortBy?: keyof T;
  isAscending?: boolean;
  keyword?: string;
}

export type { PageMeta, PaginationRequest };
