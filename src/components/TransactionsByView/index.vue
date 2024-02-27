<script setup lang="ts">
import type { TransactionResponse } from '@/types/transaction.type';
import { ViewBy } from '@/constants';
import { useTransFilterByView } from '@/composables/useTransFilterByView';
import { useTransactionFilterStore } from '@/stores/TransactionFilter';

const props = defineProps<{
  transactions: TransactionResponse[];
  view?: ViewBy;
}>();

const { transactionFilter } = useTransactionFilterStore();
const { transByCate, transByDate, loadAllCategories } = useTransFilterByView(props.transactions);

onBeforeMount(loadAllCategories);
</script>

<template>
  <div
    class="transactions-by-view"
    v-if="view === ViewBy.TRANSACTION || transactionFilter.viewBy === ViewBy.TRANSACTION"
  >
    <div v-for="(gr, i) in transByDate" :key="i">
      <div class="transaction-title">
        <n-space justify="space-between" align="center">
          <div>
            <n-h6>{{ gr.dayOfweek }},</n-h6>
            <n-h6>{{ gr.date }}</n-h6>
          </div>
          <n-p class="total">{{ gr.total > 0 ? `+${gr.total}` : gr.total }}</n-p>
        </n-space>
      </div>

      <p-transaction-link v-for="tran in gr.transactions" :key="tran.id" :transaction="tran" />
    </div>
  </div>

  <div class="transactions-by-view" v-else>
    <div v-for="({ category, total, transactions: trans }, i) in transByCate" :key="i">
      <div class="transaction-title">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <div class="img-wrapper">
              <img :src="category.imageUrl || ''" alt="Category image" />
            </div>
            <n-p>{{ category.name }}</n-p>
          </n-space>
          <n-p class="total">{{ total > 0 ? `+${total}` : total }}</n-p>
        </n-space>
      </div>

      <p-transaction-link
        :view="transactionFilter.viewBy"
        v-for="tran in trans"
        :key="tran.id"
        :transaction="tran"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.transactions-by-view {
  padding-bottom: 5rem;
  .transaction-title {
    padding: 0 2rem;
    margin: 1rem 0;
    .img-wrapper {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .total {
      font-size: 20px;
    }
  }
}
</style>
