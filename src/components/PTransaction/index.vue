<script setup lang="ts">
import { getCategoryById } from '@/api/category';
import { getRandomColor } from '@/utils/random';
import { dateFormat } from '@/utils/DateFormat';
const props = defineProps<{
  transaction: {
    image: string | null;
    categoryId: string;
    name: string;
    total: number;
    date: string;
  };
}>();

const categoryName = ref<string>('');
onBeforeMount(async () => {
  try {
    const { data } = await getCategoryById(props.transaction.categoryId);
    categoryName.value = data.data.name;
  } catch (err) {}
});
</script>

<template>
  <p-card class="transaction">
    <div class="category-img">
      <img v-if="transaction.image" :src="transaction.image" />
      <div v-else :style="{ background: getRandomColor() }"></div>
    </div>
    <div class="transaction-content">
      <n-space class="top" justify="space-between" :wrap="false">
        <h3>{{ transaction.name }}</h3>
        <h3 class="total" :class="{ negative: transaction.total > 0 }">
          {{ transaction.total > 0 ? `+$${transaction.total}` : `-$${-transaction.total}` }}
        </h3>
      </n-space>
      <n-space class="bottom" justify="space-between">
        <p>{{ categoryName }}</p>
        <p>{{ dateFormat(transaction.date, 'mmm dd') }}</p>
      </n-space>
    </div>
  </p-card>
</template>

<style lang="scss" scoped>
.transaction {
  justify-content: start;
  margin-bottom: 20px;
  .category-img {
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 10px;
    > div {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  & &-content {
    flex: 1;
    margin-left: 15px;
    .top {
      .total {
        &.negative {
          color: $green;
        }
        color: $pink;
      }
    }
    .bottom {
      color: $gray;
    }
  }
}
</style>
