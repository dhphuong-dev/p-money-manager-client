<script setup lang="ts">
import { IconBellFilled } from '@tabler/icons-vue';
</script>

<template>
  <p-header class="container" title="PMoney Manager">
    <template #function>
      <icon-bell-filled />
    </template>
  </p-header>
</template>

<route lang="yaml">
name: Home
meta:
  requiresAuth: true
  layout: main
</route>
