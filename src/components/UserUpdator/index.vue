<script setup lang="ts">
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui';

import { updateUser } from '@/api/user';
import { emaildValidator } from '@/utils/validator';

const router = useRouter();
const message = useMessage();

const props = defineProps<{
  show: boolean;
  user: {
    email: string;
    fullName: string;
    avatar: string;
  };
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
const updateDisabled = ref<boolean>(true);
const showAvatarUpload = ref<boolean>(false);
const previewAvtUrl = ref<string | undefined>(props.user.avatar);
const formValue = reactive<{
  email: string;
  fullName: string;
  avatar: UploadFileInfo[];
}>({ email: props.user.email, fullName: props.user.fullName, avatar: [] });
const formRef = ref<FormInst | null>(null);
const rules: FormRules = {
  email: {
    required: false,
    trigger: ['blur', 'input'],
    validator: emaildValidator
  },
  fullName: {
    required: false,
    trigger: 'blur',
    message: 'Please enter your full name!'
  }
};

watch(formValue, () => {
  if (
    formValue.email !== props.user.email ||
    formValue.fullName !== props.user.fullName ||
    formValue.avatar.length > 0
  ) {
    updateDisabled.value = false;
  } else if (
    formValue.email === props.user.email ||
    formValue.fullName === props.user.fullName ||
    formValue.avatar.length === 0
  ) {
    updateDisabled.value = true;
  }
});

const updateUserHandler = () => {
  formRef.value?.validate(async (error) => {
    if (!error) {
      loading.value = true;
      try {
        await updateUser(formValue);
        message.success('Update profile successful!');
        router.push('/profile');
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

const previewAvtHandler = ({
  file,
  fileList
}: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
  event?: Event;
}) => {
  previewAvtUrl.value = URL.createObjectURL(file.file as File) || props.user.avatar;
};

const removeAvtUpload = () => {
  formValue.avatar = [];
  previewAvtUrl.value = props.user.avatar;
};
</script>

<template>
  <n-drawer class="user-updator" v-model:show="_show" placement="bottom" height="100%">
    <p-header class="container" title="Update profile">
      <template #function>
        <n-icon :size="28" @click="_show = false"> <icon-x /> </n-icon>
      </template>
    </p-header>

    <div class="container">
      <n-form class="user-updator-form" :model="formValue" :rules="rules" ref="formRef">
        <div class="form-item-avatar">
          <div>
            <n-image
              object-fit="cover"
              class="avatar-img"
              width="120"
              height="120"
              :src="previewAvtUrl"
            />
            <n-upload
              :max="1"
              :show-file-list="false"
              accept="image/*"
              v-model:file-list="formValue.avatar"
              @change="previewAvtHandler"
              class="open-avatar-changer"
              v-if="formValue.avatar.length === 0"
            >
              <icon-camera :size="25" />
            </n-upload>
            <div v-else @click="removeAvtUpload" class="remove-avatar-upload">
              <icon-x :size="28" />
            </div>
          </div>
        </div>
        <n-modal v-model:show="showAvatarUpload">
          <p-card>Select avatar</p-card>
        </n-modal>

        <n-form-item label="Your email adderss" class="user-updator-form-item" path="email">
          <n-input placeholder="Your email adderss" v-model:value="formValue.email" />
        </n-form-item>
        <n-form-item label="Your full name" class="user-updator-form-item" path="fullName">
          <n-input placeholder="Your full name" v-model:value="formValue.fullName" />
        </n-form-item>
        <p-button
          style="margin-top: 1rem"
          :loading="loading"
          :disabled="updateDisabled"
          attr-type="submit"
          @click="updateUserHandler"
        >
          Save
        </p-button>
      </n-form>
    </div>
  </n-drawer>
</template>

<style lang="scss">
.user-updator {
  background-color: $bg-primary;
  &-form {
    width: 100%;
    margin: 2rem 0;
    .form-item-avatar {
      display: flex;
      justify-content: center;
      > div {
        position: relative;
        .avatar-img {
          border-radius: 50%;
        }
        .remove-avatar-upload,
        .open-avatar-changer {
          position: absolute;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          border-radius: 50%;
          cursor: pointer;
        }
        .open-avatar-changer {
          color: $primary;
          width: 4rem;
          height: 4rem;
          bottom: 0;
          transform: translate(-5%, -5%);
          .n-upload-trigger {
            width: 2.5rem;
            height: 2.5rem;
          }
        }
        .remove-avatar-upload {
          color: $pink;
          width: 3rem;
          height: 3rem;
          top: 0;
          transform: translate(-5%, -5%);
        }
      }
    }
  }
}
</style>
