<script setup lang="ts">
import { useSettingStore } from '@/stores/settings';
import { Theme } from '@/types/settings.type';

const settingsStore = useSettingStore();
</script>

<template>
  <footer :class="{ dark: settingsStore.settings.theme === Theme.DARK }">
    <div class="flex">
      <router-link :to="{ name: 'Home', params: {} }">
        <n-p>
          <icon-home-2 stroke-width="2" :size="28" />
        </n-p>
      </router-link>
      <router-link :to="{ name: 'Transaction', params: {} }">
        <n-p>
          <icon-chart-pie stroke-width="2" :size="28" />
        </n-p>
      </router-link>
      <router-link :to="{ name: 'Wallet', params: {} }">
        <n-p>
          <icon-wallet stroke-width="2" :size="28" />
        </n-p>
      </router-link>
      <router-link :to="{ name: 'Profile', params: {} }">
        <n-p>
          <icon-user stroke-width="2" :size="28" />
        </n-p>
      </router-link>
    </div>
    <router-link class="circle" to="/new-transaction">
      <n-icon>
        <icon-plus stroke-width="2" :size="28" />
      </n-icon>
    </router-link>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: $bg-white;
  &.dark {
    background: $dark;
  }
  .flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
    a {
      padding: 1.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      &:nth-child(2) {
        margin-right: 10%;
      }
      &:nth-child(3) {
        margin-left: 10%;
      }
      p {
        font-size: 3.2rem;
        line-height: 3.2rem;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
      &.router-link-exact-active p {
        color: $primary;
        transform: translateY(-20%);
      }
    }
  }

  .circle {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    font-size: 2.8rem;
    background-color: $primary;
    border-radius: 50%;
    height: 5rem;
    width: 5rem;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
