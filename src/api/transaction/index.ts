import { api } from '../axios';
import type { PageMeta, PaginationRequest } from '@/types/Pagination.types';
import type { TransactionResponse, TransactionRequest } from '@/types/transaction.type';
import type { APIResponse } from '@/types/response.type';
import { UrlConstants } from '@/constants';

const transaction = () => {
  const configFormData = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return {
    async createNewTransaction(transaction: TransactionRequest) {
      const formData = new FormData();

      formData.append('name', transaction.name);
      formData.append('total', transaction.total.toString());
      formData.append('date', transaction.date);
      formData.append('categoryId', transaction.categoryId);
      formData.append('walletId', transaction.walletId);

      transaction.location && formData.append('location', transaction.location);
      transaction.withPerson && formData.append('withPerson', transaction.withPerson);
      transaction.image &&
        transaction.image.length > 0 &&
        formData.append('image', transaction.image[0].file as File);
      return api.post<APIResponse<TransactionResponse>>(
        UrlConstants.TRANSACTION,
        formData,
        configFormData
      );
    },
    async getAllMyTransactions() {
      return api.get<APIResponse<TransactionResponse[]>>(UrlConstants.TRANSACTION + '/all/me');
    },
    async getMyTransactions(params?: PaginationRequest<TransactionResponse>) {
      return api.get<APIResponse<{ meta: PageMeta; items: TransactionResponse[] }>>(
        UrlConstants.TRANSACTION + '/me',
        { params }
      );
    },
    async getTransactionById(id: string) {
      return api.get<APIResponse<TransactionResponse>>(UrlConstants.TRANSACTION, {
        params: { id }
      });
    },
    async deleteTransactionById(id: string) {
      return api.delete<
        APIResponse<{
          status: string;
          message: string;
        }>
      >(`${UrlConstants.TRANSACTION}/${id}`);
    },
    async editTransactionById(id: string, transaction: TransactionRequest) {
      const formData = new FormData();

      formData.append('name', transaction.name);
      formData.append('total', transaction.total.toString());
      formData.append('date', transaction.date);
      formData.append('categoryId', transaction.categoryId);
      formData.append('walletId', transaction.walletId);

      transaction.location && formData.append('location', transaction.location);
      transaction.withPerson && formData.append('withPerson', transaction.withPerson);
      transaction.image &&
        transaction.image.length > 0 &&
        formData.append('image', transaction.image[0].file as File);
      return api.patchForm(`${UrlConstants.TRANSACTION}/${id}`, formData, configFormData);
    }
  };
};

export const {
  createNewTransaction,
  getAllMyTransactions,
  getMyTransactions,
  getTransactionById,
  editTransactionById,
  deleteTransactionById
} = transaction();
