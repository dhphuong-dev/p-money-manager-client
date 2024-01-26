<script setup lang="ts">
import dayjs from 'dayjs';

import { getCategoryById } from '@/api/category';
import type { TransactionResponse } from '@/types/transaction.type';
import { ViewBy } from '@/constants';

const props = defineProps<{
  transaction: TransactionResponse;
  view?: ViewBy;
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
  <router-link :to="{ name: 'TransactionId', params: { id: props.transaction.id } }">
    <p-card class="transaction">
      <div class="transaction-img">
        <img v-if="transaction.imageUrl" :src="transaction.imageUrl" />
        <div
          v-else
          :style="{ backgroundColor: transaction.total > 0 ? '#67d4ca' : '#f28080' }"
        ></div>
      </div>
      <div class="transaction-content">
        <n-space class="top" justify="space-between" :wrap="false">
          <h3>{{ transaction.name }}</h3>
          <h3 class="total" :class="{ negative: transaction.total > 0 }">
            {{ transaction.total > 0 ? `+$${transaction.total}` : `-$${-transaction.total}` }}
          </h3>
        </n-space>
        <n-space class="bottom" justify="space-between">
          <p v-if="view === ViewBy.CATEGORY">
            {{ dayjs(transaction.date).format('YYYY MMM DD, dddd') }}
          </p>
          <p v-else>{{ categoryName }}</p>
        </n-space>
      </div>
    </p-card>
  </router-link>
</template>

<style lang="scss" scoped>
.transaction {
  justify-content: start;
  // margin-bottom: 20px;
  .transaction-img {
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
