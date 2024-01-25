<script setup lang="ts">
import { use, type ComposeOption } from 'echarts/core';
import { PieChart, type PieSeriesOption } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  type TitleComponentOption,
  type TooltipComponentOption
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
use([TitleComponent, TooltipComponent, PieChart, CanvasRenderer]);
type EChartsOption = ComposeOption<TitleComponentOption | TooltipComponentOption | PieSeriesOption>;

import { CategoryType } from '@/types/category.type';
import type { TransactionsByCategory } from '@/types/transaction.type';

const props = defineProps<{
  transByCate: TransactionsByCategory[];
  type: CategoryType;
  height?: string;
}>();

const option = computed<EChartsOption>(() => {
  const transByType = props.transByCate.filter((cate) =>
    props.type === CategoryType.INCOME ? cate.total > 0 : cate.total < 0
  );
  return {
    title: {
      text: `${props.type === CategoryType.INCOME ? 'Income' : 'Expense'}: $${transByType.reduce(
        (pre, cur) => pre + cur.total,
        0
      )}`
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : ${c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['20%', '50%'],
        center: ['50%', '55%'],
        data: transByType
          .map((cate) => ({
            value: props.type === CategoryType.INCOME ? cate.total : -cate.total,
            name: cate.category.name
          }))
          .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      }
    ]
  };
});
</script>

<template>
  <v-chart :style="{ height: props?.height || '30rem' }" :option="option" autoresize />
</template>

<style lang="scss" scoped></style>
