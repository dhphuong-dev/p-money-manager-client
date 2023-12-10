<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <header style="padding-top: 2rem">
    <n-space align="center" justify="space-between">
      <n-space align="center" justify="space-between">
        <slot name="back" />
        <h2>{{ props.title }}</h2>
      </n-space>
      <slot name="function" />
    </n-space>
  </header>
</template>
