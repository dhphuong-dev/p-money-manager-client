<script setup lang="ts">
import logo from '@/assets/vite.svg';
</script>

<template>
  <div class="container">
    <div class="auth-layout">
      <div class="auth-head">
        <div>
          <img :src="logo" width="100" height="100" alt="pMoney Manager Logo" />
        </div>
        <n-h2>Best way to saving Your Money!</n-h2>
      </div>
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  padding: 6rem 0;
  .auth-head {
    padding-bottom: 2rem;
    text-align: center;
    div {
      margin-bottom: 3rem;
    }
    h2 {
      font-size: 2rem;
      line-height: 3.2rem;
    }
  }
}
</style>
