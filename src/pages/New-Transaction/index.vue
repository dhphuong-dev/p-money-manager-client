<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue';

import type { TransactionRequest } from '@/types/transaction.type';
import { createNewTransaction } from '@/api/transaction';
import { dateFormat } from '@/utils/DateFormat';

const router = useRouter();
const loadingBar = useLoadingBar();
const message = useMessage();

const transactionRef = ref<any>(null);
const transaction = reactive<TransactionRequest>({
  name: '',
  total: NaN,
  date: dateFormat(Date.now(), 'yyyy-mm-dd'),
  categoryId: '',
  walletId: ''
});

const addNewTransaction = () => {
  transactionRef.value.formRef.validate(async (errors) => {
    if (!errors) {
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
    }
  });
};
</script>

<template>
  <p-header title="New Transaction" class="container">
    <template #back>
      <n-icon :size="24" style="display: block" @click="router.back">
        <icon-chevron-left />
      </n-icon>
    </template>

    <template #function>
      <p class="add" @click="addNewTransaction">Add</p>
    </template>
  </p-header>

  <transaction-form ref="transactionRef" v-model:transaction="transaction" />
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
