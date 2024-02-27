<script setup lang="ts">
import { getMyTransactions } from '@/api/transaction';
import type { TransactionResponse } from '@/types/transaction.type';

const props = defineProps<{
  size?: number;
}>();

const message = useMessage();
const recentTrans = ref<TransactionResponse[]>([]);

onBeforeMount(async () => {
  try {
    const { data } = await getMyTransactions({ pageSize: props.size || 3 });
    recentTrans.value = data.data.items;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
  }
});
</script>

<template>
  <div class="recent-transactions">
    <n-space justify="space-between" align="center" class="container" style="margin-bottom: 1rem">
      <n-p>Recent transactions</n-p>
      <router-link class="see-all" to="/transaction">See all</router-link>
    </n-space>

    <p-transaction-link
      v-for="tran in recentTrans"
      :key="tran.id"
      :transaction="tran"
      class="transaction"
    />
  </div>
</template>

<style lang="scss" scoped>
.recent-transactions {
  padding-bottom: 7rem;
  .see-all {
    color: $primary;
  }
  .transaction {
    margin: 1rem 0 !important;
  }
}
</style>
