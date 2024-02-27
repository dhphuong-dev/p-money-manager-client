<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

import { emaildValidator } from '@/utils/validator/index';
import { resetPassword } from '@/api/auth';

const router = useRouter();
const loadingBar = useLoadingBar();

const formInstRef = ref<FormInst | null>(null);
const model = ref({ email: '' });
const loading = ref<boolean>(false);
const message = useMessage();

const rules: FormRules = {
  email: {
    required: true,
    validator: emaildValidator,
    trigger: 'blur'
  }
};

const loginHandler = async () => {
  formInstRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true;
      loadingBar.start();
      try {
        const { data } = await resetPassword(model.value.email);
        message.success(data.data.message);
        router.push({ name: 'Login', params: {} });
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

    <p-button @click="loginHandler" :loading="loading" attr-type="submit">
      Send me a new password
    </p-button>

    <div class="footer">
      <n-text>Do you remember the password ? </n-text>
      <router-link :to="{ name: 'Login', params: {} }">Login now.</router-link>
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
  }
}
</style>

<route lang="yaml">
name: ForgotPassword
meta:
  layout: auth
</route>
