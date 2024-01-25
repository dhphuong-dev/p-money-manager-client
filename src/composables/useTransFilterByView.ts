import dayjs from 'dayjs';

import type {
  TransactionResponse,
  TransactionsByCategory,
  TransactionsByDate
} from '@/types/transaction.type';
import type { CategoryResponse } from '@/types/category.type';
import { getCategoryById } from '@/api/category';

export const useTransFilterByView = (transactions: TransactionResponse[]) => {
  const message = useMessage();

  const transByDate = computed<TransactionsByDate[]>(() => {
    const allDates: string[] = transactions.map((tran) => tran.date);
    const uniqueDates: string[] = [...new Set(allDates)];
    return uniqueDates.map((date) => {
      let total = 0;
      const trans: TransactionResponse[] = [];
      transactions.forEach((tran) => {
        if (tran.date === date) {
          total += tran.total;
          trans.push(tran);
        }
      });
      return {
        date: dayjs(date).format('YYYY MMMM DD'),
        total,
        dayOfweek: dayjs(date).format('dddd'),
        transactions: trans
      };
    });
  });

  const allCategories = ref<CategoryResponse[]>([]);
  const transByCate = computed<TransactionsByCategory[]>(() => {
    const uniqueCateID: string[] = [...new Set(allCategories.value.map(({ id }) => id))];
    const uniqueCategory: CategoryResponse[] = uniqueCateID.map((id) => ({
      ...allCategories.value.find((c) => c.id === id)!
    }));

    return uniqueCategory
      .map((category) => {
        let total: number = 0;
        const trans: TransactionResponse[] = [];
        transactions.forEach((tran) => {
          if (tran.categoryId === category.id) {
            total += tran.total;
            trans.push(tran);
          }
        });
        return {
          category,
          total,
          transactions: trans
        };
      })
      .sort((a, b) => b.transactions.length - a.transactions.length);
  });

  const loadAllCategories = async () => {
    transactions.forEach(async (tran) => {
      try {
        const res = await getCategoryById(tran.categoryId);
        allCategories.value.push(res.data.data);
      } catch (err: any) {
        if (!!err.response) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      }
    });
  };

  return { transByDate, transByCate, loadAllCategories };
};
