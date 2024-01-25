import { defineStore, acceptHMRUpdate } from 'pinia';
import {
  TransactionFilterStorage,
  TimeRange,
  ViewBy
} from '@/constants/TransactionFilter.constant';
import type { TransactionFilter } from '@/types/transaction.type';

export const useTransactionFilterStore = defineStore('TransactionFilter', () => {
  const transactionFilter = reactive<TransactionFilter>({
    timeRange:
      TimeRange[localStorage.getItem(TransactionFilterStorage.TimeRange) || TimeRange.Month],
    viewBy: ViewBy[localStorage.getItem(TransactionFilterStorage.ViewBy) || ViewBy.TRANSACTION]
  });

  const saveFilter = ({ t, v }: { t?: TimeRange; v?: ViewBy }): void => {
    if (!!t) {
      transactionFilter.timeRange = t;
      localStorage.setItem(TransactionFilterStorage.TimeRange, transactionFilter.timeRange);
    }
    if (!!v) {
      transactionFilter.viewBy = v;
      localStorage.setItem(TransactionFilterStorage.ViewBy, transactionFilter.viewBy);
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
