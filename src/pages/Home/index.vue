<script setup lang="ts">
import { IconBellFilled } from '@tabler/icons-vue';

import { getMyWallet } from '@/api/wallet';
import type { WalletResponse } from '@/types/wallet.type';

const message = useMessage();
const myWallets = ref<WalletResponse[]>([]);

onBeforeMount(async () => {
  try {
    const { data } = await getMyWallet();
    myWallets.value = data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
  }
});
</script>

<template>
  <p-header class="container" title="PMoney Manager">
    <template #function>
      <icon-bell-filled />
    </template>
  </p-header>

  <p-card class="wallet-card">
    <div class="wallet-view">
      <n-space justify="space-between" align="center" class="wallet-view-title">
        <p>My Wallets</p>
        <router-link class="see-all" to="/wallet">See all</router-link>
      </n-space>
      <n-space
        v-for="w in myWallets"
        :key="w.id"
        justify="space-between"
        align="center"
        class="wallets"
      >
        <n-space align="center">
          <div class="wallet-img">
            <img width="30" height="30" src="@\assets\images\wallet.png" alt="" />
          </div>
          <p>{{ w.name }}</p>
        </n-space>
        <p>${{ w.total }}</p>
      </n-space>
    </div>
  </p-card>

  <recent-transactions />
</template>

<style lang="scss" scoped>
.see-all {
  color: $primary;
}
.wallet-card {
  margin: 2rem 0;
  .wallet-view {
    width: 100%;
    &-title {
      padding: 1rem 0;
      border-bottom: 1px solid $gray;
      p {
        font-size: 20px;
      }
    }
    .wallets {
      padding: 1rem 0;
    }
  }
}
</style>

<route lang="yaml">
name: Home
meta:
  requiresAuth: true
  layout: main
</route>
