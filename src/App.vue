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
import { darkTheme, lightTheme, useThemeVars } from 'naive-ui';
import { useSettingStore } from '@/stores/settings';
import { Theme } from './types/settings.type';

import { ColorConstant } from '@/constants';

const settingStore = useSettingStore();

const themeOverrides = reactive<GlobalThemeOverrides>({
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
  },
  Drawer: {
    color: '#f8fafb',
    headerBorderBottom: '0',
    headerPadding: '0',
    bodyPadding: '0'
  },
  Typography: {
    headerFontWeight: '700',
    pMargin: '0',
    headerMargin1: '0',
    headerMargin2: '0',
    headerMargin3: '0',
    headerMargin4: '0',
    headerMargin5: '0',
    headerMargin6: '0',
    ulPadding: '0',
    liMargin: '0'
  }
});

const theme = computed(() => (settingStore.settings.theme === Theme.DARK ? darkTheme : lightTheme));
watchEffect(() => {
  if (settingStore.settings.theme === Theme.DARK) {
    document.body.classList.add('dark');
    themeOverrides.common!.textColorBase = ColorConstant.LIGHT;
    themeOverrides.Drawer!.color = ColorConstant.BG_DARK;
    themeOverrides.Form!.labelTextColor = ColorConstant.LIGHT;
    themeOverrides.Input!.color = ColorConstant.BG_DARK;
    themeOverrides.Input!.textColor = ColorConstant.LIGHT;
    themeOverrides.Input!.colorFocus = ColorConstant.BG_DARK;
    themeOverrides.Input!.colorFocusError = ColorConstant.BG_DARK;
  } else {
    document.body.classList.remove('dark');
    themeOverrides.Drawer!.color = ColorConstant.BG_PRIMARY;
  }
});
</script>
