import type { UploadFileInfo } from 'naive-ui';

import type { CommonResponse } from './common.type';
import { TimeRange, ViewBy } from '@/constants/TransactionFilter.constant';
import type { CategoryResponse } from './category.type';

interface Transaction {
  name: string;
  total: number;
  date: string;
}

interface TransactionRequest extends Transaction {
  walletId: string;
  categoryId: string;
  image?: UploadFileInfo[];
  location?: string;
  withPerson?: string;
}

interface TransactionResponse extends CommonResponse, Transaction {
  imageUrl: string | null;
  location: string | null;
  withPerson: string | null;
  categoryId: string;
  walletId: string;
}

interface TransactionFilter {
  timeRange: TimeRange;
  viewBy: ViewBy;
}

interface TransactionsByDate {
  total: number;
  date: string;
  dayOfweek: string;
  transactions: TransactionResponse[];
}

interface TransactionsByCategory {
  category: CategoryResponse;
  total: number;
  transactions: TransactionResponse[];
}

export type {
  Transaction,
  TransactionRequest,
  TransactionResponse,
  TransactionFilter,
  TransactionsByDate,
  TransactionsByCategory
};
