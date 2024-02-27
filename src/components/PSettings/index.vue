<script setup lang="ts">
import { useSettingStore } from '@/stores/settings';
import { Theme } from '@/types/settings.type';

const settingStore = useSettingStore();
const theme = ref<Theme>(settingStore.settings.theme);
watch(theme, () => {
  settingStore.changeTheme(theme.value);
});
</script>

<template>
  <div id="settings">
    <n-p style="margin: 2rem 0 0 3rem">Display</n-p>
    <p-card class="setting">
      <n-space style="width: 100%" justify="space-between" align="center">
        <n-p>Time Format</n-p>
        <n-p>YYYY-MM-DD</n-p>
      </n-space>
    </p-card>
    <p-card class="setting">
      <n-space style="width: 100%" justify="space-between" align="center">
        <n-p>Language</n-p>
        <n-p>English</n-p>
      </n-space>
    </p-card>
    <p-card class="setting">
      <n-space style="width: 100%" justify="space-between" align="center">
        <n-p>Currency</n-p>
        <n-p>VND</n-p>
      </n-space>
    </p-card>
    <p-card class="setting">
      <n-space style="width: 100%" justify="space-between" align="center">
        <n-p>Theme</n-p>
        <label class="switch">
          <input
            v-model="theme"
            :true-value="Theme.DARK"
            :false-value="Theme.LIGHT"
            type="checkbox"
          />
          <span class="slider"></span>
        </label>
      </n-space>
    </p-card>
  </div>
</template>

<style scoped lang="scss">
#settings {
  .setting {
    margin-top: 1rem;
  }
  /* The switch - the box around the slider */
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 5.5rem;
    height: 2.8rem;
    border-radius: 30px;
    overflow: hidden;
    /* Hide default HTML checkbox */
    input {
      opacity: 0;
      width: 0;
      height: 0;
      &:checked + .slider {
        background-color: $bg-dark;
        &::before {
          transform: translate(120%, -50%);
          box-shadow: inset 6px -4px 0px 0px $light;
        }
      }
    }
    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #81bcff;
      transition: 0.5s;
      &::before {
        position: absolute;
        content: '';
        height: 2rem;
        width: 2rem;
        border-radius: 50%;
        left: 10%;
        top: 50%;
        transform: translate(0, -50%);
        box-shadow: inset 15px -4px 0px 15px #fff000;
        transition: 0.5s;
      }
    }
  }
}
</style>
