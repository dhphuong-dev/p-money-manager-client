<script setup lang="ts"></script>

<template>
  <div class="home">Introduction</div>
  <p-button @click="$router.push('/home')">Home</p-button>
</template>

<style scoped lang="scss">
.home {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<route lang="yaml">
name:
meta:
  layout: blank
</route>
