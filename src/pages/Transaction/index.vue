<script setup lang="ts">
import { IconFilter } from '@tabler/icons-vue';

import { getMyTransactions } from '@/api/transaction';
import type { TransactionResponse } from '@/types/transaction.type';

const loadingBar = useLoadingBar();
const messageDialog = useMessage();

const transactions = ref<TransactionResponse[]>([]);

onBeforeMount(async () => {
  loadingBar.start();
  try {
    const myTransactions = await getMyTransactions();
    transactions.value = myTransactions.data.data.items.map((t) => {
      return {
        image: t.imageUrl,
        ...t
      };
    });
  } catch (err: any) {
    messageDialog.error(err.message);
    loadingBar.error();
  }
  loadingBar.finish();
});
</script>

<template>
  <p-header class="container" title="My Report">
    <template #function>
      <n-icon :size="32"> <IconFilter /> </n-icon>
    </template>
  </p-header>
  <div class="report container">
    <h2 style="margin: 20px 0">Detail Transaction</h2>
    <div class="transaction-view">
      <p-transaction-link
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.report {
  height: 100%;
  h2 {
    color: $primary;
  }
  .transaction-view {
    height: 600px;
    overflow-y: scroll;
  }
}
</style>

<route lang="yaml">
name: Transaction
meta:
  requiresAuth: true
  layout: main
</route>
