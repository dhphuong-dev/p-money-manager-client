<script setup lang="ts">
import { getMyCategories } from '@/api/category';
import { CategoryType, type CategoryResponse } from '@/types/category.type';
import { getRandomColor } from '@/utils/random';

const props = defineProps<{
  show: boolean;
  category?: CategoryResponse;
  options: CategoryResponse[];
}>();
const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
  (e: 'update:category', cate: CategoryResponse): void;
}>();

const message = useMessage();

const _show = ref<boolean>(props.show);
const categories = ref<CategoryResponse[]>(props.options);
const cateTypeSelected = ref<CategoryType>(CategoryType.EXPENSE);
const categoriesFiltered = computed<CategoryResponse[]>(() =>
  categories.value
    .filter((cate: CategoryResponse) => cate.type === CategoryType[cateTypeSelected.value])
    .sort(
      (cateA: CategoryResponse, cateB: CategoryResponse) =>
        new Date(cateB.createdDate).getTime() - new Date(cateA.createdDate).getTime()
    )
);
const showNewCategory = ref<boolean>(false);

watch(
  () => props.category,
  () => {
    cateTypeSelected.value = props.category?.type as CategoryType;
  }
);
watch(
  () => props.show,
  () => {
    _show.value = props.show;
  }
);
watch(_show, () => {
  emit('update:show', _show.value);
});

const selectCategoryType = (event: Event) => {
  const element = event.target as HTMLElement;
  cateTypeSelected.value = element.getAttribute('data-category-type') as CategoryType;
};

const selectCategory = (cate: CategoryResponse) => {
  emit('update:category', cate);
  _show.value = false;
};

const reloadComponent = async (_show: boolean) => {
  showNewCategory.value = _show;
  try {
    const { data } = await getMyCategories();
    categories.value = data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
  }
};
</script>

<template>
  <n-drawer v-model:show="_show" width="100%" class="categories-selector">
    <p-header class="container" title="Select a Category">
      <template #function>
        <n-icon :size="28" @click="_show = false">
          <icon-x />
        </n-icon>
      </template>
    </p-header>

    <div class="container" style="padding-top: 2rem">
      <n-grid :cols="2" :x-gap="20">
        <n-grid-item v-for="cateType in CategoryType" :key="cateType">
          <p-card
            class="category-type"
            :class="{ selected: cateType === cateTypeSelected }"
            :data-category-type="cateType"
            @click="selectCategoryType"
          >
            {{ cateType }}
          </p-card>
        </n-grid-item>
      </n-grid>

      <p-card class="category add-new-category" @click="showNewCategory = true">
        <button>
          <n-icon :size="24"> <icon-plus :stroke-width="3" /> </n-icon>
        </button>
        <p>Add new category</p>
      </p-card>

      <div v-for="cate in categoriesFiltered" :key="cate.id">
        <p-card
          class="category"
          @click="selectCategory(cate)"
          :class="{ selected: props.category?.id === cate.id }"
        >
          <div class="cat-img">
            <img v-if="!!cate.imageUrl" :src="cate.imageUrl" alt="" />
            <div v-else class="random-color" :style="{ backgroundColor: getRandomColor() }"></div>
          </div>
          <p>{{ cate.name }}</p>
        </p-card>
      </div>
    </div>
  </n-drawer>

  <new-category :show="showNewCategory" @update:show="reloadComponent" />
</template>

<style lang="scss">
.categories-selector {
  background-color: $bg-primary;
  .category-type {
    font-size: 2rem;
    &.selected {
      color: $primary;
    }
  }
  .category {
    justify-content: start;
    flex-wrap: nowrap;
    margin: 1.5rem 0;
    font-size: 1.8rem;
    .cat-img {
      overflow: hidden;
      margin-right: 1.5rem;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .random-color {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    &.selected {
      color: $primary;
      border: 2px solid $primary;
    }
    &.add-new-category {
      color: $primary;
      button {
        background-color: $primary;
        color: white;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 2rem;
      }
    }
  }
}
</style>
