<script setup lang="ts">
import { useSettingStore } from '@/stores/settings';
import { Theme } from '@/types/settings.type';

const settingsStore = useSettingStore();
</script>

<template>
  <div class="p-card" :class="{ dark: settingsStore.settings.theme === Theme.DARK }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.p-card {
  background-color: $bg-white;
  padding: 1rem 2rem;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.dark {
    background-color: $dark;
  }
}
</style>
