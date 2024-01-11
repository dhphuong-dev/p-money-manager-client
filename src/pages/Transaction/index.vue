<script setup lang="ts">
import { IconFilter, IconSearch } from '@tabler/icons-vue';

import { getMyTransactions } from '@/api/transaction';
import type { TransactionResponse } from '@/types/transaction.type';
import { TimeRange, TimeStampSettings } from '@/constants/timeStamp.enum';
import { useTimeRangeSettingStore } from '@/stores/timeStampSetting';
import { timelineGenerator, compare, type Timeline } from '@/utils/timeLine';

const loadingBar = useLoadingBar();
const message = useMessage();
const { timeRange, changeTimeRange } = useTimeRangeSettingStore();

const timeRangeSeleted = ref<TimeRange>(timeRange);
const timelines = computed<Timeline[]>(() => timelineGenerator(timeRangeSeleted.value));
const timelineSelected = ref<number>(1);

const transactions = ref<TransactionResponse[]>([]);
const transactionsFiltered = computed<TransactionResponse[]>(() =>
  transactions.value.filter((t) =>
    compare(t.date, timelines.value, timelineSelected.value, timeRangeSeleted.value)
  )
);

const loadMyTransactions = async () => {
  loadingBar.start();
  try {
    const myTransactions = await getMyTransactions();
    transactions.value = myTransactions.data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
    loadingBar.error();
  }
  loadingBar.finish();
};
onBeforeMount(loadMyTransactions);

watch(
  () => timeRangeSeleted.value,
  () => {
    changeTimeRange(timeRangeSeleted.value);
  }
);
</script>

<template>
  <p-header class="container" title="My Report">
    <template #function>
      <n-space>
        <n-icon :size="28"> <icon-search /> </n-icon>
        <n-popselect
          v-model:value="timeRangeSeleted"
          :options="TimeStampSettings"
          size="huge"
          placement="bottom-end"
          trigger="click"
        >
          <n-icon :size="28"> <icon-filter /> </n-icon>
          <template #header> Select time range </template>
        </n-popselect>
      </n-space>
    </template>
  </p-header>
  <div class="transactions container">
    <h2 style="margin: 20px 0">Detail Transaction</h2>
    <n-tabs
      type="line"
      animated
      size="large"
      :theme-overrides="{
        tabFontWeight: 'bold',
        tabFontWeightActive: 'bold'
      }"
      v-model:value="timelineSelected"
    >
      <n-tab-pane v-for="({ label }, i) in timelines" :key="i" :name="i" :tab="label">
        <div class="transaction-view">
          <p-transaction-link
            v-for="transaction in transactionsFiltered"
            :key="transaction.id"
            :transaction="transaction"
          />
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.transactions {
  height: 100%;
  h2 {
    color: $primary;
  }
  .transaction-view {
    height: 500px;
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
@/utils/timeLine
