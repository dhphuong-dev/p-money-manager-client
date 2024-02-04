<script setup lang="ts">
import { getMyAccount } from '@/api/user';
import type { UserResponse } from '@/types/user.types';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const message = useMessage();
const { logout } = useAuthStore();

const showPassChanger = ref<boolean>(false);
const showEditProfile = ref<boolean>(false);

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

const comingSoon = () => {
  message.info('Comming soon!');
};

const logoutHandler = () => {
  logout();
  message.success('Logout successful');
  router.push('/login');
};
</script>

<template>
  <p-header class="container" title="My Account">
    <template #function>
      <n-icon :size="28" @click="router.back"> <icon-x /> </n-icon>
    </template>
  </p-header>

  <p-card class="text-primary" style="margin-top: 2rem" @click="showEditProfile = true">
    <n-space align="center">
      <img src="@/assets/images/user.png" width="28" height="28" alt="" />
      <p>Update your profile</p>
    </n-space>
  </p-card>
  <user-updator v-if="!!user" v-model:show="showEditProfile" :user="user" />

  <p-card class="text-primary" @click="comingSoon">
    <n-space align="center">
      <img src="@/assets/images/crown.png" width="28" height="28" alt="" />
      <p>Go Premium</p>
    </n-space>
  </p-card>

  <p-card class="text-primary" @click="showPassChanger = true">
    <n-space align="center">
      <img src="@/assets/images/change-password.png" width="28" height="28" alt="" />
      <p>Change password</p>
    </n-space>
  </p-card>
  <password-changer v-model:show="showPassChanger" />

  <p-card @click="logoutHandler" class="text-pink">
    <n-space align="center">
      <p>Logout</p>
    </n-space>
  </p-card>
</template>

<style scoped lang="scss">
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
.text-primary {
  color: $primary;
  margin-top: 1rem;
}
.text-pink {
  color: $pink;
  margin-top: 1rem;
}
</style>

<route lang="yaml">
name: User
meta:
  requiresAuth: true
</route>
