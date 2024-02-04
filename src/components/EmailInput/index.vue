<script setup lang="ts">
const value = ref<string>('');
const options = computed(() => {
  return ['@gmail.com', '@google.com'].map((suffix) => {
    const prefix = value.value.split('@')[0];
    return {
      label: prefix + suffix,
      value: prefix + suffix
    };
  });
});
</script>

<template>
  <n-auto-complete
    v-model:value="value"
    :options="options"
    size="large"
    placeholder="example@gmail.com"
  />
</template>
