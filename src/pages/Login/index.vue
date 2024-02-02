<script setup lang="ts">
import type { FormInst, FormItemRule } from 'naive-ui';

import { passwordValidator, emaildValidator } from '@/utils/validator/index';
import type { ILoginBody } from '@/types/auth.types';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const loadingBar = useLoadingBar();
const message = useMessage();
const { login } = useAuthStore();

const formInstRef = ref<FormInst | null>(null);
const model = ref<ILoginBody>({ email: '', password: '' });
const loading = ref<boolean>(false);

const rules = {
  email: {
    required: true,
    validator: emaildValidator,
    trigger: 'blur'
  },
  password: {
    required: true,
    validator: passwordValidator,
    trigger: 'blur'
  }
};

const loginHandler = async () => {
  formInstRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true;
      loadingBar.start();
      try {
        await login(model.value);
        message.success('Login succesful');
        router.push((route.query.redirect as string) || '/home');
      } catch (err: any) {
        if (!!err.response) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
        loadingBar.error();
      } finally {
        loading.value = false;
        loadingBar.finish();
      }
    }
  });
};
</script>

<template>
  <n-form ref="formInstRef" :rules="rules" :model="model" class="login-form">
    <n-form-item label="Email Address" path="email" class="form-element">
      <email-input v-model:value="model.email" />
    </n-form-item>

    <n-form-item label="Password" path="password" class="form-element">
      <n-input type="password" size="large" placeholder="password" v-model:value="model.password" />
    </n-form-item>

    <p-button @click="loginHandler" :loading="loading" attr-type="submit">Login</p-button>

    <div class="footer">
      <router-link :to="{ name: 'ForgotPassword', params: {} }" class="footer-link"
        >Forgot password ?</router-link
      >
    </div>

    <div class="footer">
      <span>Have not you an account ? </span>
      <router-link :to="{ name: 'Register', params: {} }" class="footer-link"
        >Register now.</router-link
      >
    </div>
  </n-form>
</template>

<style scoped lang="scss">
.login-form {
  button {
    margin: 1rem 0;
  }
  .footer {
    text-align: center;
    .footer-link {
      color: $primary;
    }
  }
}
</style>

<route lang="yaml">
name: Login
meta:
  layout: auth
</route>
