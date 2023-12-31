<script setup lang="ts">
import type { UploadFileInfo, FormInst, FormRules } from 'naive-ui';
import { useLoadingBar, useMessage } from 'naive-ui';
import { IconCamera } from '@tabler/icons-vue';
import { AxiosError } from 'axios';

import { createNewCategory } from '@/api/category';
import { CategoryType, type CategoryRequest } from '@/types/category.type';
import QuestionImg from '@/assets/images/categories/question-mark.png';

const props = defineProps<{
  show: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
}>();

const loadingBar = useLoadingBar();
const message = useMessage();

const _show = ref<boolean>(props.show);
const previewImg = ref<string | undefined>();
const formRef = ref<FormInst | null>(null);
const formValue = ref<CategoryRequest>({
  name: '',
  type: CategoryType.EXPENSE,
  image: []
});
const rules: FormRules = {
  name: {
    required: true,
    message: 'Please type category name'
  }
};

watchEffect(() => {
  _show.value = props.show;
});

watchEffect(() => {
  emit('update:show', _show.value);
});

const selectCategoryType = (event: Event) => {
  const element = event.target as HTMLElement;
  formValue.value.type = element.getAttribute('data-category-type') as CategoryType;
};

const addNewCategoryHandler = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loadingBar.start();
      try {
        await createNewCategory(formValue.value);
        message.success('Create new category is successful');
        _show.value = false;
      } catch (err: any) {
        if (!!err.response) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
        loadingBar.error();
      } finally {
        formValue.value = {
          name: '',
          type: CategoryType.EXPENSE,
          image: []
        };
        loadingBar.finish();
      }
    }
  });
};

const previewCateImage = ({
  file,
  fileList,
  event
}: {
  file: UploadFileInfo;
  fileList: Array<UploadFileInfo>;
  event?: Event;
}) => {
  if (fileList.length > 0) previewImg.value = URL.createObjectURL(fileList[0].file as File);
  else previewImg.value = undefined;
};
</script>

<template>
  <!-- New category -->
  <n-drawer v-model:show="_show" width="100%" class="new-category">
    <p-header class="container" title="Add new a Category">
      <template #function>
        <p class="add" @click="_show = false">Cancle</p>
      </template>
    </p-header>

    <n-form ref="formRef" :model="formValue" :rules="rules">
      <div class="wrapper">
        <n-form-item :show-label="false" path="type">
          <n-grid :cols="2" :x-gap="20">
            <n-grid-item v-for="cateType in CategoryType" :key="cateType">
              <p-card
                class="category-type"
                :class="{ selected: cateType === formValue.type }"
                :data-category-type="cateType"
                @click="selectCategoryType"
              >
                {{ cateType }}
              </p-card>
            </n-grid-item>
          </n-grid>
        </n-form-item>

        <n-form-item :show-label="false" path="name">
          <div class="form-item">
            <div class="category-img">
              <img :src="previewImg ? previewImg : QuestionImg" alt="" />
            </div>

            <div class="input-wrapper">
              <n-input
                :theme-overrides="{
                  paddingMedium: '0'
                }"
                :bordered="false"
                placeholder="Category name"
                v-model:value="formValue.name"
              />
            </div>
          </div>
        </n-form-item>

        <n-form-item :show-label="false" path="image">
          <n-upload
            :max="1"
            directory-dnd
            accept="image/*"
            v-model:file-list="formValue.image"
            @change="previewCateImage"
          >
            <div class="form-item">
              <n-icon :size="24">
                <icon-camera />
              </n-icon>
              <p>Upload photo</p>
            </div>
          </n-upload>
        </n-form-item>

        <button @click="addNewCategoryHandler">Add</button>
      </div>
    </n-form>
  </n-drawer>
</template>

<style lang="scss">
.new-category {
  background-color: $bg-primary;
  .category-type {
    font-size: 1.6rem;
    &.selected {
      color: $primary;
      border: 2px solid $primary;
    }
  }
  .wrapper {
    background-color: white;
    padding: 2rem;
    margin: 2rem auto;
    .form-item {
      display: flex;
      align-items: center;
      width: 100%;
      .input-wrapper {
        border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        flex: 1;
        margin-left: 2rem;
        input {
          font-weight: bold;
          width: 100%;
          outline: none;
        }
      }
      p {
        font-size: 1.8rem;
        margin-left: 3rem;
      }
      .category-img {
        height: 4rem;
        width: 4rem;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    button {
      padding: 1rem 2rem;
      font-size: 2rem;
      background-color: $primary;
      color: white;
      border-radius: 8px;
    }
  }
}
</style>
