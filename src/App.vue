<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="theme">
    <n-message-provider :max="1">
      <n-loading-bar-provider>
        <n-dialog-provider>
          <router-view></router-view>
        </n-dialog-provider>
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui';
import { darkTheme, lightTheme } from 'naive-ui';
import { useSettingStore } from '@/stores/setting';
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0012ff',
    baseColor: '#0012ff',
    textColorBase: '#363853'
  },
  Form: {
    labelTextColor: '#363853',
    labelPaddingVertical: '1rem 0',
    labelFontWeight: 'bold'
  },
  Input: {
    border: 'none',
    borderRadius: '8px',
    placeholderColor: '#9e9e9f'
  },
  Button: {
    color: '#0012ff',
    colorFocus: '#0012ff',
    colorHover: '#0012ff',
    colorPressed: '#0012ff',
    textColorHover: 'none',
    textColorPressed: 'none',
    colorDisabled: '#9e9e9f'
  }
};

const settingStore = useSettingStore();
const theme = computed(() => (settingStore.darkMode ? darkTheme : lightTheme));
</script>
