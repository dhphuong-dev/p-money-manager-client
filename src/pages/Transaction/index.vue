<script setup lang="ts">
import dayjs from 'dayjs';

import { getAllMyTransactions } from '@/api/transaction';
import type { TransactionFilter, TransactionResponse } from '@/types/transaction.type';
import { TimeRange } from '@/constants';
import { useTransactionFilterStore } from '@/stores/TransactionFilter';
import { timelineGenerator, compare, type Timeline } from '@/utils/timeLine';
import { useSettingStore } from '@/stores/settings';
import { Theme } from '@/types/settings.type';

const message = useMessage();
const filterStore = useTransactionFilterStore();
const settingsStore = useSettingStore();

const showFilter = ref<boolean>(false);
const openReport = ref<boolean>(false);
const reloadTimelineTabs = ref<boolean>(true);
const transactions = ref<TransactionResponse[]>([]);

const filter = reactive<TransactionFilter>(filterStore.transactionFilter);
const timelines = computed<Timeline[]>(() => timelineGenerator(filter.timeRange));
const timelineSelected = ref<number>(
  +!(filter.timeRange === TimeRange.All || filter.timeRange === TimeRange.Custom)
);

const transByTimeline = computed<TransactionResponse[]>(() =>
  transactions.value
    .filter((t) => compare(t.date, timelines.value, timelineSelected.value, filter.timeRange))
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
  () => Object.values(filter),
  () => {
    reloadTimelineTabs.value = false;
    setTimeout(() => {
      reloadTimelineTabs.value = true;
    }, 0);
  }
);
watchEffect(() => {
  timelineSelected.value = +!(
    filter.timeRange === TimeRange.All || filter.timeRange === TimeRange.Custom
  );
});
</script>

<template>
  <p-header class="container" title="My Transactions">
    <template #function>
      <n-space>
        <n-p> <icon-search :size="28" /> </n-p>
        <n-p @click="showFilter = true">
          <icon-filter :size="28" />
        </n-p>
      </n-space>
    </template>
  </p-header>

  <transaction-filter v-model:show="showFilter" />

  <div class="transactions">
    <h2>Detail Transaction</h2>
    <Transition>
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
        v-if="reloadTimelineTabs"
      >
        <n-tab-pane v-for="({ label }, i) in timelines" :key="i" :name="i" :tab="label">
          <div class="transaction-view" v-if="transByTimeline.length">
            <div
              class="transaction-overview"
              :class="{ dark: settingsStore.settings.theme === Theme.DARK }"
            >
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
            <transactions-by-view :view="filter.viewBy" :transactions="transByTimeline" />
          </div>
          <n-empty v-else description="No transactions" size="huge"></n-empty>
        </n-tab-pane>
      </n-tabs>
    </Transition>
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
      background-color: $bg-white;
      padding: 2rem;
      margin-bottom: 1rem;
      &.dark {
        background-color: $dark;
      }
      .line {
        margin-bottom: 1rem;
      }
      hr {
        border-bottom: 0.1px solid $gray;
        margin-bottom: 1rem;
      }
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
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
  transition: transform 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  transform: translate(-2rem, 0);
  opacity: 0;
}
</style>

<route lang="yaml">
name: Transaction
meta:
  requiresAuth: true
  layout: main
</route>
