<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();
</script>

<template>
  <header>
    <n-space align="center" justify="space-between">
      <n-space align="center" justify="space-between">
        <div class="header-back">
          <slot name="back" />
        </div>
        <n-h2>{{ props.title }}</n-h2>
      </n-space>
      <div class="header-function">
        <slot name="function" />
      </div>
    </n-space>
  </header>
</template>

<style lang="scss" scoped>
header {
  padding-top: 2rem;
  .header-back,
  .header-function {
    cursor: pointer;
  }
}
</style>
