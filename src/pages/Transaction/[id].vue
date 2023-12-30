<script setup lang="ts">
import {
  IconChevronLeft,
  IconNotes,
  IconCalendarEvent,
  IconWallet,
  IconMapPinCheck,
  IconUsers
} from '@tabler/icons-vue';

import type { TransactionResponse } from '@/types/transaction.type';
import type { CategoryResponse } from '@/types/category.type';
import type { WalletResponse } from '@/types/wallet.type';
import { getTransactionById } from '@/api/transaction';
import { getCategoryById } from '@/api/category';
import { getWalletById } from '@/api/wallet';

import { dateFormat } from '@/utils/DateFormat';

const route = useRoute();
const loadingBar = useLoadingBar();
const messageDialog = useMessage();

const transaction = ref<TransactionResponse>();
const category = ref<CategoryResponse>();
const wallet = ref<WalletResponse>();

onBeforeMount(async () => {
  loadingBar.start();
  try {
    const transactionResponse = await getTransactionById(route.params.id as string);
    transaction.value = transactionResponse.data.data;

    const categoryResponse = await getCategoryById(transaction.value.categoryId);
    category.value = categoryResponse.data.data;

    const walletResponse = await getWalletById(transaction.value.walletId);
    wallet.value = walletResponse.data.data;
  } catch (err: any) {
    messageDialog.error(err.message);
    loadingBar.error();
  }
  loadingBar.finish();
});

const editTransaction = () => {};
</script>

<template>
  <div>
    <p-header title="Transaction" class="container">
      <template #back>
        <n-icon :size="24" style="display: block" @click="$router.back">
          <icon-chevron-left />
        </n-icon>
      </template>

      <template #function>
        <p class="add" @click="editTransaction">Edit</p>
      </template>
    </p-header>

    <div class="transaction" v-if="!!transaction && !!category && !!wallet">
      <div class="section" v-if="!!transaction.imageUrl">
        <div class="transaction-img">
          <n-image :src="transaction.imageUrl" />
        </div>
      </div>
      <div class="section">
        <div class="line">
          <div class="label">
            <div class="usd">USD</div>
          </div>
          <div class="">
            <p>Total</p>
            <p class="total" :class="{ negative: transaction.total < 0 }">
              {{ transaction.total > 0 ? transaction.total : -transaction.total }}
            </p>
          </div>
        </div>
        <div class="line">
          <div class="label">
            <n-icon :size="24">
              <icon-notes />
            </n-icon>
          </div>
          <p>{{ transaction.name }}</p>
        </div>
        <div class="line">
          <div class="label category-img">
            <img :src="category.imageUrl || ''" alt="" />
          </div>
          <p>{{ category.name }}</p>
        </div>
        <div class="line">
          <div class="label">
            <n-icon :size="24">
              <icon-calendar-event />
            </n-icon>
          </div>
          <p>{{ dateFormat(transaction.date, 'ddd, dd mmm yyyy') }}</p>
        </div>
        <div class="line">
          <div class="label">
            <n-icon :size="24">
              <icon-wallet />
            </n-icon>
          </div>
          <p>{{ wallet.name }}</p>
        </div>
      </div>
      <div class="section" v-if="!!transaction.location || !!transaction.withPerson">
        <div class="line" v-if="!!transaction.location">
          <div class="label">
            <n-icon :size="24">
              <icon-map-pin-check />
            </n-icon>
          </div>
          <p>{{ transaction.location }}</p>
        </div>
        <div class="line" v-if="!!transaction.withPerson">
          <div class="label">
            <n-icon :size="24">
              <icon-users />
            </n-icon>
          </div>
          <p>{{ transaction.withPerson }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.transaction {
  .section {
    background-color: #ffffff;
    padding: 2rem;
    margin: 2rem 0;
    overflow: hidden;
  }
  .line {
    display: flex;
    align-items: center;
    padding: 0.8rem 0;
    .label {
      text-align: right;
      width: 5rem;
      margin-right: 2rem;
      .usd {
        border: 2px solid black;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
    }
  }
  .total {
    color: $green;
    font-size: 28px;
    &.negative {
      color: $pink;
    }
  }
  .transaction-img {
    height: 150px;
    text-align: center;
    > div {
      height: 100%;
    }
  }
  .category-img {
    img {
      display: block;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      object-fit: cover;
    }
  }
}
</style>

<route lang="yaml">
name: TransactionId
meta:
  requiresAuth: true
  layout: blank
</route>
