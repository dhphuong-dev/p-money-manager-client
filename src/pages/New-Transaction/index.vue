<script setup lang="ts">
import {
  IconChevronLeft,
  IconNotes,
  IconCalendarEvent,
  IconWallet,
  IconMapPinCheck,
  IconUsers,
  IconCamera
} from '@tabler/icons-vue';

import type { SelectOption, FormRules, FormInst } from 'naive-ui';
import type { WalletResponse } from '@/types/wallet.type';
import type { CategoryResponse } from '@/types/category.type';
import type { TransactionRequest } from '@/types/transaction.type';

import { getMyWallet } from '@/api/wallet';
import { getMyCategories } from '@/api/category';
import { createNewTransaction } from '@/api/transaction';

import { isNumber } from '@/utils/is';
import { dateFormat } from '@/utils/DateFormat';

const router = useRouter();
const loadingBar = useLoadingBar();
const messageAlert = useMessage();

const isMoreDetails = ref<boolean>(false);
const isShowCategoriesSelector = ref<boolean>(false);
const selectedCategory = ref<CategoryResponse | undefined>();
const categoryOptions = ref<CategoryResponse[]>([]);
const timestamp = ref<number>(Date.now());
const walletOptions = ref<SelectOption[]>([]);

const formRef = ref<FormInst | null>(null);
const formValue = reactive<TransactionRequest>({
  name: '',
  total: NaN,
  date: dateFormat(timestamp.value, 'yyyy-mm-dd'),
  categoryId: '',
  walletId: ''
});
const rules: FormRules = {
  name: {
    required: true,
    message: 'The transaction name is required',
    trigger: 'input'
  },
  total: {
    required: true,
    validator() {
      if (!isNumber(formValue.total) || isNaN(formValue.total))
        return new Error('The transaction total must be a number');
      if (formValue.total === 0) return new Error('The transaction total must be different from 0');
      return true;
    },
    trigger: 'input'
  },
  category: {
    required: true,
    validator() {
      if (!!formValue.categoryId) return true;
      else return new Error('Please select a category');
    }
  },
  date: {
    required: true,
    message: 'Please select date'
  },
  wallet: {
    required: true,
    validator() {
      if (!!formValue.walletId) return true;
      else return new Error('Please select your wallet');
    }
  },
  location: {
    required: false
  },
  'with-person': {
    required: false
  },
  image: {
    required: false
  }
};

onBeforeMount(async () => {
  try {
    const walletResponse = await getMyWallet();
    walletResponse.data.data.forEach((wallet: WalletResponse) => {
      walletOptions.value.push({
        label: `${wallet.name}: $${wallet.total}`,
        value: wallet.id
      });
    });
    formValue.walletId = walletOptions.value[0].value as string;

    const { data } = await getMyCategories();
    categoryOptions.value = data.data;
  } catch (err: any) {
    console.log(err);
  }
});

watchEffect(() => {
  formValue.categoryId = selectedCategory.value?.id || '';
});

const addNewTransaction = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loadingBar.start();
      try {
        await createNewTransaction(formValue);
        messageAlert.success('Succesfull create transaction');
        router.back();
      } catch (err: any) {
        console.log(err);
        messageAlert.error(err.response.data.messsage);
        loadingBar.error();
      } finally {
        loadingBar.finish();
      }
    }
  });
};
</script>

<template>
  <p-header title="New Transaction" class="container">
    <template #back>
      <n-icon :size="24" style="display: block" @click="router.back">
        <icon-chevron-left />
      </n-icon>
    </template>

    <template #function>
      <p class="add" @click="addNewTransaction">Add</p>
    </template>
  </p-header>

  <n-form id="new-transaction" :rules="rules" ref="formRef" :model="formValue">
    <div class="wrapper">
      <n-form-item :show-label="false" path="total">
        <div class="form-item">
          <div class="label">
            <div class="usd">USD</div>
          </div>

          <div class="input-wrapper">
            <p>Total</p>
            <input
              type="number"
              id="total"
              min="0"
              placeholder="0"
              v-model.number="formValue.total"
            />
          </div>
        </div>
      </n-form-item>

      <n-form-item :show-label="false" path="name">
        <div class="form-item">
          <div class="label">
            <n-icon :size="24">
              <icon-notes />
            </n-icon>
          </div>
          <div class="input-wrapper">
            <n-input
              :theme-overrides="{
                paddingMedium: '0'
              }"
              :bordered="false"
              placeholder="Name"
              v-model:value="formValue.name"
            />
          </div>
        </div>
      </n-form-item>

      <n-form-item :show-label="false" path="category">
        <div class="form-item" @click="isShowCategoriesSelector = true">
          <div class="category-img">
            <img
              :src="selectedCategory?.imageUrl || 'src/assets/images/categories/question-mark.png'"
              alt=""
            />
          </div>
          <p>{{ selectedCategory?.name || 'Select a category' }}</p>
        </div>

        <categories-selector
          v-model:show="isShowCategoriesSelector"
          v-model:category="selectedCategory"
          :options="categoryOptions"
        />
      </n-form-item>

      <n-form-item :show-label="false" path="date">
        <div class="form-item">
          <div class="label">
            <n-icon :size="24">
              <icon-calendar-event />
            </n-icon>
          </div>
          <div class="input-wrapper">
            <n-date-picker
              :bordered="false"
              :theme-overrides="{
                peers: {
                  Button: {
                    textColor: 'white',
                    fontSizeTiny: '16px'
                  },
                  Input: {
                    paddingMedium: '0',
                    fontSizeMedium: '16px'
                  }
                },
                calendarTitleFontWeight: 'bold',
                itemFontSize: '16px'
              }"
              format="EEE, dd MMM yyyy"
              v-model:value="timestamp"
            />
          </div>
        </div>
      </n-form-item>

      <n-form-item :show-label="false" path="wallet">
        <div class="form-item">
          <div class="label">
            <n-icon :size="24">
              <icon-wallet />
            </n-icon>
          </div>

          <div class="input-wrapper" style="border: none">
            <n-select
              :bordered="false"
              :theme-overrides="{
                peers: {
                  InternalSelection: {
                    paddingSingle: '0'
                  }
                }
              }"
              :options="walletOptions"
              placeholder="Select Wallet"
              v-model:value="formValue.walletId"
            />
          </div>
        </div>
      </n-form-item>
    </div>

    <div v-if="!isMoreDetails" class="wrapper">
      <button class="more-details" @click="isMoreDetails = true">More Details</button>
    </div>

    <div v-else>
      <div class="wrapper">
        <n-form-item :show-label="false" path="location">
          <div class="form-item">
            <div class="label">
              <n-icon :size="24">
                <icon-map-pin-check />
              </n-icon>
            </div>
            <div class="input-wrapper">
              <n-input
                :theme-overrides="{
                  paddingMedium: '0'
                }"
                :bordered="false"
                id="location"
                placeholder="Select a location"
                v-model:value="formValue.location"
              />
            </div>
          </div>
        </n-form-item>

        <n-form-item :show-label="false" path="with-person">
          <div class="form-item">
            <div class="label">
              <n-icon :size="24">
                <icon-users />
              </n-icon>
            </div>
            <div class="input-wrapper" style="border: none">
              <n-input
                :theme-overrides="{
                  paddingMedium: '0'
                }"
                :bordered="false"
                id="with-person"
                placeholder="With person"
                v-model:value="formValue.withPerson"
              />
            </div>
          </div>
        </n-form-item>
      </div>

      <div class="wrapper upload-photo" style="padding: 0 2rem">
        <n-form-item path="image">
          <n-upload :max="1" directory-dnd accept="image/*" v-model:file-list="formValue.image">
            <div class="form-item">
              <div class="label">
                <n-icon :size="24">
                  <icon-camera />
                </n-icon>
              </div>
              <div class="input-wrapper" style="border: none">Upload photo</div>
            </div>
          </n-upload>
        </n-form-item>
      </div>
    </div>
  </n-form>
</template>

<style scoped lang="scss" src="./NewTransaction.scss">
.add {
  padding: 1rem;
  font-size: 20px;
  font-weight: bold;
}
</style>

<route lang="yaml">
name: New Transaction
meta:
  requiresAuth: true
  layout: blank
</route>
