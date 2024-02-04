<script setup lang="ts">
import type { TransactionResponse } from '@/types/transaction.type';
import { CategoryType } from '@/types/category.type';
import { useTransFilterByView } from '@/composables/useTransFilterByView';

const props = defineProps<{
  show: boolean;
  transactions: TransactionResponse[];
}>();
const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
}>();

const _show = ref<boolean>(props.show);
const { transByCate, loadAllCategories } = useTransFilterByView(props.transactions);
onBeforeMount(loadAllCategories);

watchEffect(() => {
  _show.value = props.show;
});

watchEffect(() => {
  emit('update:show', _show.value);
});
</script>

<template>
  <n-drawer v-model:show="_show" placement="bottom" height="100%" class="report">
    <p-header class="container" title="Report">
      <template #function>
        <n-icon :size="28" @click="_show = false">
          <icon-x />
        </n-icon>
      </template>
    </p-header>

    <div class="report-view">
      <p-card class="report-chart-wrapper">
        <transactions-chart-by-category :transByCate="transByCate" :type="CategoryType.INCOME" />
      </p-card>
      <p-card class="report-chart-wrapper">
        <transactions-chart-by-category :transByCate="transByCate" :type="CategoryType.EXPENSE" />
      </p-card>
    </div>
  </n-drawer>
</template>

<style lang="scss">
.report {
  background-color: $bg-primary;
  .report-view {
    height: 90vh;
    overflow-y: scroll;
    .report-chart-wrapper {
      margin-top: 2rem;
    }
  }
}
</style>
