<script setup lang="ts">
import {
  IconSettings,
  IconChevronRight,
  IconWallet,
  IconBoxSeam,
  IconLock,
  IconInfoSquareRounded,
  IconLogout
} from '@tabler/icons-vue';

import { getMyAccount } from '@/api/user';
import type { UserResponse } from '@/types/user.types';
import { useAuthStore } from '@stores/auth';

const router = useRouter();
const loadingBar = useLoadingBar();
const message = useMessage();
const { logout } = useAuthStore();

const navigates = [
  {
    route: 'Wallet',
    name: 'My Wallets',
    icon: IconWallet
  },
  {
    route: 'Home',
    name: 'Categories',
    icon: IconBoxSeam
  },
  {
    route: 'Home',
    name: 'Pricvacy',
    icon: IconLock
  },
  {
    route: 'Home',
    name: 'About',
    icon: IconInfoSquareRounded
  }
];

const user = ref<UserResponse>();
onBeforeMount(async () => {
  loadingBar.start();
  try {
    const { data } = await getMyAccount();
    user.value = data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
    loadingBar.error();
  }
  document.title = `${user.value?.fullName} - pMoney Manager`;
  loadingBar.finish();
});

const openSetting = () => {};

const logoutHandler = () => {
  logout();
  message.success('Logout successful');
  router.push({ name: 'Login' });
};
</script>

<template>
  <p-header class="container" title="My Profile">
    <template #function>
      <n-icon :size="32" @click="openSetting"> <icon-settings /> </n-icon>
    </template>
  </p-header>

  <div class="container" id="profile">
    <n-space class="user" vertical align="center">
      <n-avatar round :size="90" :src="user?.avatar" />
      <div class="name">{{ user?.fullName }}</div>
      <div class="email">{{ user?.email }}</div>
    </n-space>

    <div class="general">General</div>

    <router-link
      v-for="(navigate, i) in navigates"
      :key="i"
      :to="{ name: navigate.route }"
      class="link-item"
    >
      <n-space align="center" justify="space-between">
        <n-space align="center" justify="space-between">
          <n-icon :size="28">
            <component :is="navigate.icon" />
          </n-icon>
          <span>{{ navigate.name }}</span>
        </n-space>
        <n-icon :size="28">
          <IconChevronRight />
        </n-icon>
      </n-space>
    </router-link>

    <div @click="logoutHandler" class="link-item">
      <n-space align="center" justify="space-between">
        <n-space align="center" justify="space-between" class="logout">
          <n-icon :size="28">
            <IconLogout />
          </n-icon>
          <span>Logout</span>
        </n-space>
        <n-icon :size="28">
          <IconChevronRight />
        </n-icon>
      </n-space>
    </div>
  </div>
</template>

<style scoped lang="scss">
#profile {
  .user {
    padding: 2rem 0;
    .name {
      font-size: 2.4rem;
      color: $primary;
      font-weight: bold;
    }
    .email {
      color: $gray;
      font-size: 2rem;
    }
  }

  .general {
    color: $primary;
    font-size: 2.2rem;
    font-weight: bold;
    margin-top: 2rem;
  }

  .link-item {
    display: block;
    padding: 1rem 0;
    margin: 1rem 0;
    color: $dark;
    span {
      font-size: 1.8rem;
      font-weight: bold;
    }

    .logout {
      color: $pink;
    }
  }
}
</style>

<route lang="yaml">
name: Profile
meta:
  requiresAuth: true
  layout: main
</route>
