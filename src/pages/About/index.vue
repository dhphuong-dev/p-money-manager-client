<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';

const router = useRouter();
const message = useMessage();
const comingSoon = () => {
  message.info('Comming soon!');
};

const AppName = 'pMoney Manager';
const origin = location.origin;
const linkShare = `https://www.facebook.com/dialog/share?app_id=2650938021721465&display=page&href=${origin}&redirect_uri=${origin}`;
</script>

<template>
  <p-header class="container" title="About">
    <template #function>
      <n-icon :size="28" @click="router.back"> <icon-x /> </n-icon>
    </template>
  </p-header>

  <div class="about">
    <n-space class="about-app" justify="center" align="center" vertical>
      <img src="@/assets/vite.svg" width="100" height="100" alt="" />
      <h2 class="app-name">{{ AppName }}</h2>
      <p>version 1.0.0</p>
      <p>by Hoàng Phương</p>
    </n-space>

    <a href="https://www.facebook.com/fuonghight" target="_blank">
      <p-card class="about-card">
        <div class="about-line">
          <img src="@/assets/images/about/facebook-icon.png" width="40" height="40" alt="" />
          <p>Hoàng Phương</p>
        </div>
      </p-card>
    </a>

    <p-card class="about-card" @click="comingSoon">
      <div class="about-line">
        <img src="@/assets/images/about/facebook-icon.png" width="40" height="40" alt="" />
        <p>Share</p>
      </div>
    </p-card>

    <a style="margin: 5rem 0" href="https://forms.gle/LeueNfZ7i5uiJjMn6" target="_blank">
      <p-card class="about-card">
        <div class="about-line">
          <img src="@/assets/images/about/wrench-screwdriver.png" width="40" height="40" alt="" />
          <p>Developers</p>
        </div>
      </p-card>
    </a>

    <a href="mailto:hoangphuong270703@gmail.com">
      <p-card class="about-card">
        <div class="about-line">
          <img src="@/assets/images/about/mail.png" width="40" height="40" alt="" />
          <p>For partnership</p>
        </div>
      </p-card>
    </a>

    <p-card class="about-card" @click="comingSoon">
      <div class="about-line">
        <img src="@/assets/images/about/translate.png" width="40" height="40" alt="" />
        <p>Help Us Translate</p>
      </div>
    </p-card>
  </div>
</template>

<style scoped lang="scss">
.about {
  .about-app {
    margin: 2rem 0;
  }
  a {
    display: block;
  }
  .about-card {
    margin: 1rem 0;
    .about-line {
      display: flex;
      align-items: center;
      width: 100%;
      img {
        margin-right: 2rem;
      }
    }
  }
}
</style>

<route lang="yaml">
name: About
meta:
  layout: blank
</route>
