import type { UploadFileInfo } from 'naive-ui';

import type { CommonResponse } from './common.type';

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

export type { Transaction, TransactionRequest, TransactionResponse };
