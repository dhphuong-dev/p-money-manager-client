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

const router = useRouter();
const message = useMessage();

const navigates = [
  {
    route: 'User',
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

const openSettings = ref<boolean>(false);
</script>

<template>
  <p-header class="container" title="My Profile">
    <template #function>
      <n-p @click="openSettings = true"> <icon-settings :size="28" /> </n-p>
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
            <n-p>
              <component :is="navigate.icon" :size="28" />
            </n-p>
            <n-text>{{ navigate.name }}</n-text>
          </n-space>
          <n-p>
            <IconChevronRight :size="28" />
          </n-p>
        </n-space>
      </p-card>
    </router-link>
  </div>

  <n-drawer v-model:show="openSettings" placement="bottom" height="100%">
    <n-drawer-content :header-style="{ display: 'block' }">
      <template #header>
        <p-header class="container" title="Settings">
          <template #function>
            <n-p @click="openSettings = false"> <icon-x :size="28" /> </n-p>
          </template>
        </p-header>
      </template>
      <!-- <n-icon :size="28" @click="openSettings = false"> <icon-x /> </n-icon> -->
      <p-settings />
    </n-drawer-content>
  </n-drawer>
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
  }
}
</style>

<route lang="yaml">
name: Profile
meta:
  requiresAuth: true
  layout: main
</route>
