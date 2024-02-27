<script setup lang="ts">
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
      <n-p @click="router.back"> <icon-x :size="28" /> </n-p>
    </template>
  </p-header>

  <div class="about">
    <n-space class="about-app" justify="center" align="center" vertical>
      <img src="@/assets/vite.svg" width="100" height="100" alt="" />
      <n-h2 class="app-name">{{ AppName }}</n-h2>
      <n-p>version 1.0.0</n-p>
      <n-p>by Hoàng Phương</n-p>
    </n-space>

    <a href="https://www.facebook.com/fuonghight" target="_blank">
      <p-card class="about-card">
        <div class="about-line">
          <img src="@/assets/images/about/facebook-icon.png" width="40" height="40" alt="" />
          <n-p>Hoàng Phương</n-p>
        </div>
      </p-card>
    </a>

    <a>
      <p-card class="about-card" @click="comingSoon">
        <div class="about-line">
          <img src="@/assets/images/about/facebook-icon.png" width="40" height="40" alt="" />
          <n-p>Share</n-p>
        </div>
      </p-card>
    </a>

    <a style="margin: 5rem 0" href="https://forms.gle/LeueNfZ7i5uiJjMn6" target="_blank">
      <p-card class="about-card">
        <div class="about-line">
          <img src="@/assets/images/about/wrench-screwdriver.png" width="40" height="40" alt="" />
          <n-p>Developers</n-p>
        </div>
      </p-card>
    </a>

    <a href="mailto:hoangphuong270703@gmail.com">
      <p-card class="about-card">
        <div class="about-line">
          <img src="@/assets/images/about/mail.png" width="40" height="40" alt="" />
          <n-p>For partnership</n-p>
        </div>
      </p-card>
    </a>

    <a>
      <p-card class="about-card" @click="comingSoon">
        <div class="about-line">
          <img src="@/assets/images/about/translate.png" width="40" height="40" alt="" />
          <n-p>Help Us Translate</n-p>
        </div>
      </p-card>
    </a>
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
