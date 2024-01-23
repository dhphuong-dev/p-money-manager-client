<script setup lang="ts">
import { IconX, IconCalendarMonth } from '@tabler/icons-vue';

import { getCategoryById } from '@/api/category';
import type { TransactionResponse } from '@/types/transaction.type';
import { CategoryType, type CategoryResponse } from '@/types/category.type';

const props = defineProps<{
  show: boolean;
  transactions: TransactionResponse[];
}>();
const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
}>();

const _show = ref<boolean>(props.show);
const allCategories = ref<CategoryResponse[]>([]);
const transByCate = computed<
  { id: string; name: string; total: number; transaction: TransactionResponse[] }[]
>(() => {
  const uniqueCateID: string[] = [...new Set(allCategories.value.map(({ id }) => id))];
  const uniqueCategory: { id: string; name: string }[] = uniqueCateID.map((id) => ({
    id,
    name: allCategories.value.find((c) => c.id === id)?.name!
  }));

  return uniqueCategory.map((cate) => {
    let total: number = 0;
    const trans: TransactionResponse[] = [];
    props.transactions.forEach((tran) => {
      if (tran.categoryId === cate.id) {
        total += tran.total;
        trans.push(tran);
      }
    });
    return {
      ...cate,
      total,
      transaction: trans
    };
  });
});

onBeforeMount(async () => {
  props.transactions.forEach(async (tran) => {
    try {
      const res = await getCategoryById(tran.categoryId);
      allCategories.value.push(res.data.data);
    } catch (err: any) {}
  });
});

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
