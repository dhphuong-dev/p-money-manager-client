<script setup lang="ts">
import dayjs from 'dayjs';
import type { FormInst, FormRules } from 'naive-ui';

import { useTransactionFilterStore } from '@/stores/TransactionFilter';
import { TimeRange, ViewBy } from '@/constants';

const props = defineProps<{
  show: boolean;
}>();
const emits = defineEmits<{
  (e: 'update:show', show: boolean): void;
}>();

const filterStore = useTransactionFilterStore();

const _show = ref<boolean>(props.show);
const showTimeRange = ref<boolean>(false);
const showCustomTimeRange = ref<boolean>(false);

const formRef = ref<FormInst | null>(null);
const formValue = reactive<{
  start: number;
  end: number;
}>({
  start: filterStore.transactionFilter.start || dayjs().startOf('w').valueOf(),
  end: filterStore.transactionFilter.end || dayjs().endOf('w').valueOf()
});
const rules: FormRules = {
  start: {
    required: true,
    message: 'Please select starting date!'
  },
  end: {
    required: true,
    message: 'Please select end date!'
  }
};

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
  filterStore.saveFilter({ v });
  _show.value = false;
};
const onSelectTimeRange = (t: TimeRange): void => {
  filterStore.saveFilter({ t });
  showTimeRange.value = false;
};
const customTimeRangeHandler = () => {
  formRef.value?.validate((error) => {
    if (!error) {
      showCustomTimeRange.value = false;
      filterStore.saveFilter({ t: TimeRange.Custom, s: formValue.start, e: formValue.end });
    }
  });
};
</script>

<template>
  <n-drawer v-model:show="_show" placement="bottom" height="20%">
    <div class="transaction-filter">
      <n-p>Filter</n-p>
      <n-p @click="showSelectTimeRangeOption">Select time range</n-p>
      <n-p
        v-if="filterStore.transactionFilter.viewBy === ViewBy.TRANSACTION"
        @click="changeTransactionView(ViewBy.CATEGORY)"
      >
        View by category
      </n-p>
      <n-p v-else @click="changeTransactionView(ViewBy.TRANSACTION)">View by transaction</n-p>
    </div>
  </n-drawer>

  <n-drawer v-model:show="showTimeRange" placement="bottom" height="45%">
    <div class="transaction-filter">
      <n-p>Select time range</n-p>
      <n-p @click="onSelectTimeRange(TimeRange.Day)">{{ TimeRange.Day }}</n-p>
      <n-p @click="onSelectTimeRange(TimeRange.Week)">{{ TimeRange.Week }}</n-p>
      <n-p @click="onSelectTimeRange(TimeRange.Month)">{{ TimeRange.Month }}</n-p>
      <n-p @click="onSelectTimeRange(TimeRange.Year)">{{ TimeRange.Year }}</n-p>
      <n-p @click="onSelectTimeRange(TimeRange.All)">{{ TimeRange.All }}</n-p>
      <n-p
        @click="
          () => {
            showTimeRange = false;
            showCustomTimeRange = true;
          }
        "
      >
        {{ TimeRange.Custom }}
      </n-p>
    </div>
  </n-drawer>

  <n-drawer v-model:show="showCustomTimeRange" width="100%">
    <p-header title="Custom" class="container">
      <template #function>
        <n-p @click="showCustomTimeRange = false">
          <icon-x :size="28" />
        </n-p>
      </template>
    </p-header>
    <p-card class="custom-time-range">
      <div class="container">
        <n-form class="custom-time-range-form" :rules="rules" :model="formValue" ref="formRef">
          <n-form-item label="STARTING DATE" path="start" :label-style="{ fontSize: '16px' }">
            <n-date-picker
              :bordered="false"
              size="large"
              style="width: 100%"
              :theme-overrides="{
                peers: {
                  Button: {
                    textColor: 'white',
                    fontSizeTiny: '16px',
                    paddingTiny: '1.5rem'
                  },
                  Input: {
                    fontSizeLarge: '16px'
                  }
                },
                calendarTitleFontWeight: 'bold',
                itemFontSize: '16px',
                calendarTitleFontSize: '18px'
              }"
              format="EEE, dd MMM yyyy"
              v-model:value="formValue.start"
            />
          </n-form-item>
          <n-form-item label="END DATE" path="end" :label-style="{ fontSize: '16px' }">
            <n-date-picker
              :bordered="false"
              size="large"
              style="width: 100%"
              :theme-overrides="{
                peers: {
                  Button: {
                    textColor: 'white',
                    fontSizeTiny: '16px',
                    paddingTiny: '1.5rem'
                  },
                  Input: {
                    fontSizeLarge: '16px'
                  }
                },
                calendarTitleFontWeight: 'bold',
                itemFontSize: '16px',
                calendarTitleFontSize: '18px'
              }"
              format="EEE, dd MMM yyyy"
              v-model:value="formValue.end"
            />
          </n-form-item>
        </n-form>
        <p-button @click="customTimeRangeHandler" attr-type="submit">Done</p-button>
      </div>
    </p-card>
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
.custom-time-range {
  margin-top: 2rem;
  padding: 2rem 0 !important;
}
</style>
