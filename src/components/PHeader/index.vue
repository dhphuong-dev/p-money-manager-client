<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();
</script>

<template>
  <header>
    <n-space align="center" justify="space-between">
      <n-space align="center" justify="space-between">
        <slot name="back" class="header-back" />
        <h2>{{ props.title }}</h2>
      </n-space>
      <slot name="function" class="header-function" />
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
