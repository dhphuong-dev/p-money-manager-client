<script setup lang="ts">
import type { SelectOption, FormRules, FormInst, UploadFileInfo } from 'naive-ui';
import dayjs from 'dayjs';

import type { WalletResponse } from '@/types/wallet.type';
import type { CategoryResponse } from '@/types/category.type';
import type { TransactionRequest } from '@/types/transaction.type';
import { getMyWallet } from '@/api/wallet';
import { getMyCategories, getCategoryById } from '@/api/category';
import { isNumber } from '@/utils/is';

const props = defineProps<{
  transaction?: TransactionRequest;
}>();
const emit = defineEmits<{
  (e: 'submit', transaction: TransactionRequest): void;
}>();
const message = useMessage();

const isMoreDetails = ref<boolean>(
  !!props.transaction?.withPerson || !!props.transaction?.location
);
const isShowCategoriesSelector = ref<boolean>(false);
const selectedCategory = ref<CategoryResponse>();
const categoryOptions = ref<CategoryResponse[]>([]);
const timestamp = ref<number>(dayjs(props.transaction?.date).valueOf());
const walletOptions = ref<SelectOption[]>([]);
const previewImg = ref<string | undefined>();

const formRef = ref<FormInst | null>(null);
const formValue = reactive<TransactionRequest>(
  props.transaction || {
    name: '',
    total: NaN,
    date: dayjs(timestamp.value).format('YYYY-MM-DD'),
    categoryId: '',
    walletId: ''
  }
);
formValue.total = formValue.total > 0 ? formValue.total : -formValue.total;
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

watch(selectedCategory, () => {
  formValue.categoryId = selectedCategory.value?.id!;
});
watch(timestamp, () => {
  formValue.date = dayjs(timestamp.value).format('YYYY-MM-DD');
});

onBeforeMount(async () => {
  try {
    const [walletResponse, categoriesResponse] = await Promise.all([
      getMyWallet(),
      getMyCategories()
    ]);
    walletResponse.data.data.forEach((wallet: WalletResponse) => {
      walletOptions.value.push({
        label: `${wallet.name}: $${wallet.total}`,
        value: wallet.id
      });
    });
    categoryOptions.value = categoriesResponse.data.data;

    if (!formValue.walletId) {
      formValue.walletId = walletOptions.value[0].value as string;
    }
    if (!!formValue.categoryId) {
      const { data } = await getCategoryById(formValue.categoryId);
      selectedCategory.value = data.data;
    }
  } catch (err: any) {
    if (!!err.response) {
      message.error(err.response.data.message);
    } else {
      message.error(err.message);
    }
  }
});

const previewTransactionImage = ({
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

const saveTransaction = () => {
  formRef.value?.validate((error) => {
    if (!error) {
      emit('submit', formValue);
    }
  });
};
</script>

<template>
  <n-form id="transaction-form" :rules="rules" :model="formValue" ref="formRef">
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

      <div class="wrapper upload-photo">
        <n-form-item path="image" :show-feedback="false" :show-label="false">
          <n-upload
            :max="1"
            directory-dnd
            accept="image/*"
            v-model:file-list="formValue.image"
            @change="previewTransactionImage"
          >
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
        <div class="preview-transaction" v-if="!!previewImg">
          <img :src="previewImg" alt="aaaaa" />
        </div>
      </div>
    </div>

    <div class="container" style="margin-bottom: 4rem">
      <p-button @click="saveTransaction" attr-type="submit">Save</p-button>
    </div>
  </n-form>
</template>

<style scoped lang="scss">
#transaction-form {
  .wrapper {
    background-color: white;
    margin: 0 auto;
    padding: 2rem;
    margin: 2rem 0;

    .form-item {
      display: flex;
      align-items: center;
      width: 100%;
      .label {
        width: 5rem;
        text-align: right;
      }
      .input-wrapper {
        border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        flex: 1;
        margin-left: 2rem;
        input {
          font-weight: bold;
          width: 100%;
          outline: none;
          &#total {
            font-size: 28px;
          }
        }
        p {
          font-size: 1.8rem;
        }
      }
      .category-img {
        height: 4rem;
        width: 4rem;
        margin-right: 2.5rem;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .usd {
    border: 2px solid black;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .more-details {
    background-color: #fff;
    color: $primary;
    font-weight: bold;
    width: 100%;
    text-align: center;
  }

  .upload-photo {
    color: $primary;
    font-weight: bold;
    padding: 2rem;
  }

  .preview-transaction {
    margin-top: 2rem;
    height: 200px;
    overflow: hidden;
    text-align: center;
    > img {
      width: 80%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
    }
  }
}
</style>
