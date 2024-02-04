<script setup lang="ts">
import type { TransactionRequest } from '@/types/transaction.type';
import { createNewTransaction } from '@/api/transaction';

const router = useRouter();
const loadingBar = useLoadingBar();
const message = useMessage();

const addNewTransaction = async (transaction: TransactionRequest) => {
  loadingBar.start();
  try {
    await createNewTransaction(transaction);
    message.success('Succesfull create a new transaction');
    router.back();
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
    loadingBar.error();
  } finally {
    loadingBar.finish();
  }
};
</script>

<template>
  <p-header title="New Transaction" class="container">
    <template #function>
      <n-icon :size="28" @click="router.back">
        <icon-x />
      </n-icon>
    </template>
  </p-header>

  <transaction-form @submit="addNewTransaction" />
</template>

<style scoped lang="scss">
.add {
  padding: 1rem;
  font-size: 20px;
  font-weight: bold;
}
</style>

<route lang="yaml">
name: New Transaction
meta:
  requiresAuth: true
  layout: blank
</route>
