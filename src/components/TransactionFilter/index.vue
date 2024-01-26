<script setup lang="ts">
import { useTransactionFilterStore } from '@/stores/TransactionFilter';
import { TimeRange, ViewBy } from '@/constants/TransactionFilter.constant';
import type { TransactionFilter } from '@/types/transaction.type';

const props = defineProps<{
  show: boolean;
}>();
const emits = defineEmits<{
  (e: 'update:show', show: boolean): void;
}>();

const { saveFilter, transactionFilter } = useTransactionFilterStore();

const _show = ref<boolean>(props.show);
const showTimeRange = ref<boolean>(false);
watch(
  () => props.show,
  () => {
    _show.value = props.show;
  }
);
watchEffect(() => {
  emits('update:show', _show.value);
});

const showSelectTimeRangeOption = () => {
  _show.value = false;
  showTimeRange.value = true;
};
const changeTransactionView = (v: ViewBy) => {
  saveFilter({ v });
  _show.value = false;
};
const onSelectTimeRange = (t: TimeRange): void => {
  saveFilter({ t });
  showTimeRange.value = false;
};
</script>

<template>
  <n-drawer v-model:show="_show" placement="bottom" height="20%">
    <div class="transaction-filter">
      <p>Filter</p>
      <p @click="showSelectTimeRangeOption">Select time range</p>
      <p
        v-if="transactionFilter.viewBy === ViewBy.TRANSACTION"
        @click="changeTransactionView(ViewBy.CATEGORY)"
      >
        View by category
      </p>
      <p v-else @click="changeTransactionView(ViewBy.TRANSACTION)">View by transaction</p>
    </div>
  </n-drawer>

  <n-drawer v-model:show="showTimeRange" placement="bottom" height="45%">
    <div class="transaction-filter">
      <p>Select time range</p>
      <p v-for="t in Object.values(TimeRange)" :key="t" @click="onSelectTimeRange(t)">
        {{ t }}
      </p>
    </div>
  </n-drawer>
</template>

<style lang="scss">
.transaction-filter {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    &:not(:first-child) {
      color: $primary;
      font-size: 18px;
      cursor: pointer;
      &:active,
      &:hover {
        background-color: #dedfe4;
      }
    }
    &:not(:last-child) {
      border-bottom: 1px solid $gray;
    }
  }
}
</style>
