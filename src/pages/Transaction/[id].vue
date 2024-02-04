<script setup lang="ts">
import dayjs from 'dayjs';

import type { TransactionRequest, TransactionResponse } from '@/types/transaction.type';
import type { CategoryResponse } from '@/types/category.type';
import type { WalletResponse } from '@/types/wallet.type';
import { getTransactionById, deleteTransactionById, editTransactionById } from '@/api/transaction';
import { getCategoryById } from '@/api/category';
import { getWalletById } from '@/api/wallet';

const router = useRouter();
const route = useRoute();
const loadingBar = useLoadingBar();
const message = useMessage();
const dialog = useDialog();

const transaction = ref<TransactionResponse>();
const category = ref<CategoryResponse>();
const wallet = ref<WalletResponse>();
const isEdit = ref<boolean>(false);
const transactionEdit = ref<TransactionRequest>({
  name: '',
  total: NaN,
  date: dayjs().format('YYYY-MM-DD'),
  walletId: '',
  categoryId: ''
});

onBeforeMount(async () => {
  try {
    const transactionResponse = await getTransactionById(route.params.id as string);
    transaction.value = transactionResponse.data.data;
    transactionEdit.value = {
      ...transaction.value,
      location: transaction.value.location!,
      withPerson: transaction.value.withPerson!
    };

    const [categoryResponse, walletResponse] = await Promise.all([
      getCategoryById(transaction.value.categoryId),
      getWalletById(transaction.value.walletId)
    ]);
    category.value = categoryResponse.data.data;
    wallet.value = walletResponse.data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
  }
});

const editTransaction = async (payload: TransactionRequest) => {
  loadingBar.start();
  try {
    await editTransactionById(transaction.value?.id!, payload);
    message.success('Edit transaction successful');
    setTimeout(() => {
      isEdit.value = false;
    }, 500);
    router.back();
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
    loadingBar.error();
  } finally {
    loadingBar.finish();
  }
};

const deleteTransaction = () => {
  const d = dialog.error({
    title: 'Delete this transaction?',
    negativeText: 'NO',
    positiveText: 'YES',
    positiveButtonProps: {
      color: '#ffffff',
      textColor: '#0012ff',
      size: 'large',
      themeOverrides: {
        fontSizeLarge: '16px',
        fontWeight: 'bold'
      }
    },
    negativeButtonProps: {
      color: '#ffffff',
      textColor: '#0012ff',
      size: 'large',
      themeOverrides: {
        fontSizeLarge: '16px',
        fontWeight: 'bold'
      }
    },
    onPositiveClick: async () => {
      d.loading = true;
      try {
        const { data } = await deleteTransactionById(transaction.value?.id!);
        message.success(data.data.message);
        router.push({ name: 'Transaction' });
      } catch (err: any) {
        if (!!err.response) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      }
      d.loading = false;
    }
  });
};
</script>

<template>
  <div v-if="!!transaction && !!category && !!wallet">
    <p-header class="container">
      <template #back>
        <n-icon :size="24" style="display: block" @click="router.back">
          <icon-x />
        </n-icon>
      </template>

      <template #function>
        <n-space>
          <n-icon :size="24" style="display: block" @click="isEdit = true">
            <icon-edit />
          </n-icon>
          <n-icon :size="24" style="display: block" @click="deleteTransaction">
            <icon-trash />
          </n-icon>
        </n-space>
      </template>
    </p-header>

    <div id="transaction-details">
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
              {{ transaction.total }}
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
          <p>
            {{ dayjs(transaction.date).format('ddd, DD MMM YYYY') }}
          </p>
        </div>
        <div class="line">
          <div class="label">
            <n-icon :size="24">
              <icon-wallet />
            </n-icon>
          </div>
          <p>{{ `${wallet.name}: $${wallet.total}` }}</p>
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

    <n-drawer :show="isEdit" placement="bottom" height="100%" class="edit-transaction">
      <p-header class="container" title="Edit transaction">
        <template #function>
          <n-icon :size="24" style="display: block" @click="isEdit = false">
            <icon-x />
          </n-icon>
        </template>
      </p-header>

      <transaction-form :transaction="transactionEdit" @submit="editTransaction" />
    </n-drawer>
  </div>
</template>

<style lang="scss">
#transaction-details {
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
.edit-transaction {
  background-color: $bg-primary;
}
</style>

<route lang="yaml">
name: TransactionId
meta:
  requiresAuth: true
  layout: blank
</route>
