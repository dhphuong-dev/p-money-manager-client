<script setup lang="ts">
import { createNewCategory } from '@/api/category';
import { CategoryType, type CategoryRequest } from '@/types/category.type';

const props = defineProps<{
  show: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
}>();

const loadingBar = useLoadingBar();
const message = useMessage();

const _show = ref<boolean>(props.show);
const category = ref<CategoryRequest>({
  name: '',
  type: CategoryType.EXPENSE,
  image: []
});

watchEffect(() => {
  _show.value = props.show;
  category.value = {
    name: '',
    type: CategoryType.EXPENSE,
    image: []
  };
});

watchEffect(() => {
  emit('update:show', _show.value);
});

const addNewCategoryHandler = async (payload: CategoryRequest) => {
  loadingBar.start();
  try {
    await createNewCategory(payload);
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
    category.value = {
      name: '',
      type: CategoryType.EXPENSE,
      image: []
    };
    loadingBar.finish();
  }
};
</script>

<template>
  <!-- New category -->
  <n-drawer v-model:show="_show" width="100%" class="new-category">
    <p-header class="container" title="Add new a Category">
      <template #function>
        <n-icon :size="28" @click="_show = false">
          <icon-x />
        </n-icon>
      </template>
    </p-header>

    <category-form v-model:category="category" @submit="addNewCategoryHandler" />
  </n-drawer>
</template>

<style lang="scss">
.new-category {
  background-color: $bg-primary;
}
</style>
