import { defineStore, acceptHMRUpdate } from 'pinia';
import { TimeRange, ViewBy, ELocalStorage } from '@/constants';
import type { TransactionFilter } from '@/types/transaction.type';

export const useTransactionFilterStore = defineStore('TransactionFilter', () => {
  const transactionFilter = reactive<TransactionFilter>(
    JSON.parse(localStorage.getItem(ELocalStorage.TRANSACTION_FILTER)!) || {
      timeRange: TimeRange.Day,
      viewBy: ViewBy.TRANSACTION
    }
  );

  const saveFilter = ({ t, v }: { t?: TimeRange; v?: ViewBy }): void => {
    if (!!t) {
      transactionFilter.timeRange = t;
      localStorage.setItem(ELocalStorage.TRANSACTION_FILTER, JSON.stringify(transactionFilter));
    }
    if (!!v) {
      transactionFilter.viewBy = v;
      localStorage.setItem(ELocalStorage.TRANSACTION_FILTER, JSON.stringify(transactionFilter));
    }
  };

  return {
    transactionFilter,
    saveFilter
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransactionFilterStore, import.meta.hot));
}
