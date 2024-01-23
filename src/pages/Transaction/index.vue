<script setup lang="ts">
import { IconFilter, IconSearch } from '@tabler/icons-vue';

import { getAllMyTransactions } from '@/api/transaction';
import type { TransactionResponse } from '@/types/transaction.type';
import { TimeRange, TimeStampSettings } from '@/constants/timeStamp.enum';
import { useTimeRangeSettingStore } from '@/stores/timeStampSetting';
import { timelineGenerator, compare, type Timeline } from '@/utils/timeLine';
import dayjs from 'dayjs';

const message = useMessage();
const { timeRange, changeTimeRange } = useTimeRangeSettingStore();

const timeRangeSeleted = ref<TimeRange>(timeRange);
const timelines = computed<Timeline[]>(() => timelineGenerator(timeRangeSeleted.value));
const timelineSelected = ref<number>(1);

const transactions = ref<TransactionResponse[]>([]);
const transByTimeline = computed<TransactionResponse[]>(() =>
  transactions.value
    .filter((t) => compare(t.date, timelines.value, timelineSelected.value, timeRangeSeleted.value))
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
);
const total = computed<{ income: number; expenses: number }>(() => ({
  income: transByTimeline.value
    .filter((t) => t.total > 0)
    .map((t) => t.total)
    .reduce((pre, cur) => pre + cur, 0),
  expenses: transByTimeline.value
    .filter((t) => t.total < 0)
    .map((t) => t.total)
    .reduce((pre, cur) => pre + cur, 0)
}));
const transByDate = computed<
  {
    total: number;
    date: string;
    dayOfweek: string;
    transactions: TransactionResponse[];
  }[]
>(() => {
  const allDates: string[] = transByTimeline.value.map((tran) => tran.date);
  const uniqueDates: string[] = [...new Set(allDates)];
  return uniqueDates.map((date) => {
    let total = 0;
    const trans: TransactionResponse[] = [];
    transByTimeline.value.forEach((tran) => {
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

const openReport = ref<boolean>(false);

const loadMyTransactions = async () => {
  try {
    const myTransactions = await getAllMyTransactions();
    transactions.value = myTransactions.data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
  }
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
  <p-header class="container" title="My Transactions">
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

  <div class="transactions">
    <h2>Detail Transaction</h2>
    <n-tabs
      type="line"
      animated
      size="large"
      :theme-overrides="{
        tabFontWeight: 'bold',
        tabFontWeightActive: 'bold'
      }"
      :tabs-padding="20"
      v-model:value="timelineSelected"
    >
      <n-tab-pane v-for="({ label }, i) in timelines" :key="i" :name="i" :tab="label">
        <div class="transaction-view" v-if="transByTimeline.length">
          <div class="transaction-overview">
            <n-space class="line" justify="space-between">
              <p>Income</p>
              <p class="total">{{ total.income !== 0 ? `+${total.income}` : 0 }}</p>
            </n-space>
            <n-space class="line" justify="space-between">
              <p>Expense</p>
              <p class="total">{{ total.expenses }}</p>
            </n-space>
            <hr />
            <n-space justify="space-between">
              <p></p>
              <p class="total">
                {{
                  total.expenses + total.income > 0
                    ? `+${total.expenses + total.income}`
                    : total.expenses + total.income
                }}
              </p>
            </n-space>
            <p class="view-report">
              <span @click="openReport = true">View report</span>
            </p>
          </div>

          <p-report v-model:show="openReport" :transactions="transByTimeline" />

          <!-- Transactions -->
          <div v-for="(gr, i) in transByDate" :key="i">
            <div class="transaction-title">
              <n-space justify="space-between" align="center">
                <div>
                  <p>{{ gr.dayOfweek }},</p>
                  <p>{{ gr.date }}</p>
                </div>
                <p class="total">{{ gr.total > 0 ? `+${gr.total}` : gr.total }}</p>
              </n-space>
            </div>

            <p-transaction-link
              v-for="tran in gr.transactions"
              :key="tran.id"
              :transaction="tran"
            />
          </div>
        </div>
        <n-empty v-else description="No transactions" size="huge"></n-empty>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.transactions {
  height: 100%;
  .total {
    font-size: 20px;
  }
  h2 {
    color: $primary;
    padding: 0 2rem;
    margin-top: 2rem;
  }
  .transaction-view {
    height: 70vh;
    overflow-y: scroll;
    .transaction-overview {
      background-color: #ffffff;
      padding: 2rem;
      margin-bottom: 1rem;
      .line {
        margin-bottom: 1rem;
      }
      hr {
        border-bottom: 0.1px solid $gray;
        margin-bottom: 1rem;
      }
    }
    .transaction-title {
      padding: 0 2rem;
      margin-bottom: 1rem;
    }
    .view-report {
      text-align: center;
      color: $primary;
      span {
        padding: 1rem;
        cursor: pointer;
      }
    }
  }
}
</style>

<route lang="yaml">
name: Transaction
meta:
  requiresAuth: true
  layout: main
</route>
