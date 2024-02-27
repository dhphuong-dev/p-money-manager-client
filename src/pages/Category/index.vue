<script setup lang="ts">
import { getMyCategories } from '@/api/category';
import { CategoryType, type CategoryResponse } from '@/types/category.type';
import { getRandomColor } from '@/utils/random';

const message = useMessage();
const loadingBar = useLoadingBar();

const categories = ref<CategoryResponse[]>([]);
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

const reloadComponent = async (_show: boolean) => {
  showNewCategory.value = _show;
  loadingBar.start();
  try {
    const { data } = await getMyCategories();
    categories.value = data.data;
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
    loadingBar.error();
  }
  loadingBar.finish();
};
</script>

<template>
  <div class="categories container">
    <p-header title="My Category">
      <template #function>
        <n-p @click="$router.back()">
          <icon-x :size="28" />
        </n-p>
      </template>
    </p-header>

    <div style="padding-top: 2rem">
      <n-grid :cols="2" :x-gap="20">
        <n-grid-item v-for="cateType in CategoryType" :key="cateType">
          <p-card
            class="category-type"
            :class="{ selected: cateType === cateTypeSelected }"
            @click="cateTypeSelected = cateType"
          >
            <n-p>{{ cateType }}</n-p>
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
        <p-card class="category">
          <div class="cat-img">
            <img v-if="!!cate.imageUrl" :src="cate.imageUrl" alt="" />
            <div v-else class="random-color" :style="{ backgroundColor: getRandomColor() }"></div>
          </div>
          <n-p>{{ cate.name }}</n-p>
        </p-card>
      </div>
    </div>
  </div>

  <new-category :show="showNewCategory" @update:show="reloadComponent" />
</template>

<style lang="scss">
.categories {
  .category-type {
    font-size: 2rem;
    &.selected {
      p {
        color: $primary !important;
      }
      border: 2px solid $primary;
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

<route lang="yaml">
name: Category
meta:
  layout: blank
</route>
