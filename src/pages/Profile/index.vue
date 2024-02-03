<script setup lang="ts">
import {
  IconSettings,
  IconChevronRight,
  IconUser,
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
const message = useMessage();
const { logout } = useAuthStore();

const navigates = [
  {
    route: 'Home',
    name: 'My Account',
    icon: IconUser
  },
  {
    route: 'Wallet',
    name: 'My Wallets',
    icon: IconWallet
  },
  {
    route: 'Category',
    name: 'Categories',
    icon: IconBoxSeam
  },
  {
    route: 'Privacy Policy',
    name: 'Privacy Policy',
    icon: IconLock
  },
  {
    route: 'About',
    name: 'About',
    icon: IconInfoSquareRounded
  }
];

const user = ref<UserResponse>();
onBeforeMount(async () => {
  try {
    const { data } = await getMyAccount();
    user.value = data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
  }
  document.title = `${user.value?.fullName} - pMoney Manager`;
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
      <n-icon :size="28" @click="openSetting"> <icon-settings /> </n-icon>
    </template>
  </p-header>

  <div id="profile">
    <n-space class="user" vertical align="center">
      <n-avatar round :size="90" :src="user?.avatar" />
      <div class="name">{{ user?.fullName }}</div>
      <div class="email">{{ user?.email }}</div>
    </n-space>

    <router-link v-for="(navigate, i) in navigates" :key="i" :to="{ name: navigate.route }">
      <p-card class="link-item">
        <n-space style="width: 100%" align="center" justify="space-between">
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
      </p-card>
    </router-link>

    <p-card @click="logoutHandler" class="link-item">
      <n-space style="width: 100%" align="center" justify="space-between">
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
    </p-card>
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
  .link-item {
    width: 100%;
    margin: 1rem 0;
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
