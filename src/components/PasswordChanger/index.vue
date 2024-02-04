<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

import { useAuthStore } from '@stores/auth';
import { changePassword } from '@/api/user';
import { passwordValidator } from '@/utils/validator';

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();

const props = defineProps<{
  show: boolean;
}>();
const emits = defineEmits<{
  (e: 'update:show', show: boolean);
}>();

const _show = ref<boolean>(props.show);
watch(
  () => props.show,
  () => {
    _show.value = props.show;
  }
);
watchEffect(() => {
  emits('update:show', _show.value);
});

const loading = ref<boolean>(false);
const formValue = reactive<{
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}>({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});
const formRef = ref<FormInst | null>(null);
const rules: FormRules = {
  currentPassword: {
    required: true,
    trigger: 'blur',
    message: 'Please enter your current password!'
  },
  newPassword: {
    required: true,
    trigger: 'blur',
    validator: passwordValidator
  },
  confirmNewPassword: {
    required: true,
    trigger: 'blur',
    validator: (_, value: string) => {
      if (!value.trim()) {
        return new Error('Please confirm your new password!');
      } else if (value !== formValue.newPassword) {
        return new Error('Confirm password must match new password!');
      }
      return true;
    }
  }
};

const changePasswordHandler = () => {
  formRef.value?.validate(async (error) => {
    if (!error) {
      loading.value = true;
      try {
        const { data } = await changePassword(formValue);
        if (data.data.status) {
          authStore.logout();
          message.success(data.data.message);
          router.push('/login');
        } else message.error(data.data.message);
      } catch (err: any) {
        if (!!err.response) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      }
      loading.value = false;
    }
  });
};
</script>

<template>
  <n-drawer class="password-changer" v-model:show="_show" placement="bottom" height="100%">
    <p-header class="container" title="Change Password">
      <template #function>
        <n-icon :size="28" @click="_show = false"> <icon-x /> </n-icon>
      </template>
    </p-header>

    <div class="container">
      <n-form
        class="password-changer-form"
        :show-label="false"
        :model="formValue"
        :rules="rules"
        ref="formRef"
      >
        <n-form-item class="password-changer-form-item" path="currentPassword">
          <n-input
            type="password"
            show-password-on="click"
            placeholder="Current password"
            v-model:value="formValue.currentPassword"
          />
        </n-form-item>
        <n-form-item class="password-changer-form-item" path="newPassword">
          <n-input
            type="password"
            show-password-on="click"
            placeholder="New password"
            v-model:value="formValue.newPassword"
          />
        </n-form-item>
        <n-form-item class="password-changer-form-item" path="confirmNewPassword">
          <n-input
            type="password"
            show-password-on="click"
            placeholder="Confirm password"
            v-model:value="formValue.confirmNewPassword"
          />
        </n-form-item>
        <p-button
          :loading="loading"
          style="margin: 1rem 0"
          attr-type="submit"
          @click="changePasswordHandler"
        >
          Save
        </p-button>
      </n-form>

      <router-link to="/forgot-password">
        <p-card>
          <p class="fortgot-password">Forgot password?</p>
        </p-card>
      </router-link>
    </div>
  </n-drawer>
</template>

<style lang="scss">
.password-changer {
  background-color: $bg-primary;
  .password-changer-form {
    width: 100%;
    margin: 2rem 0;
  }
}
.fortgot-password {
  color: $primary;
}
</style>
