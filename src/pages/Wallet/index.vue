<script setup lang="ts">
import { IconEdit, IconTrash, IconX } from '@tabler/icons-vue';
import type { FormInst, FormRules } from 'naive-ui';

import { getMyWallet, createNewWallet, editWalletName, deleteWalletById } from '@/api/wallet';
import type { WalletResponse } from '@/types/wallet.type';

const loadingBar = useLoadingBar();
const message = useMessage();
const dialog = useDialog();

const myWallets = ref<WalletResponse[]>([]);
const loadMyWallets = async () => {
  loadingBar.start();
  try {
    const { data } = await getMyWallet();
    myWallets.value = data.data;
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
onBeforeMount(loadMyWallets);

const isAdd = ref<boolean>(false);
const isEdit = ref<boolean>(false);

const formInstRef = ref<FormInst | null>(null);
const walletFormValue = reactive<{ id?: string; name: string }>({ name: '' });
const rules: FormRules = {
  name: {
    required: true,
    message: 'Please enter name of wallet!',
    trigger: 'input'
  }
};

const walletFunctions = [
  {
    name: 'Edit Wallet',
    icon: IconEdit,
    clickHandler(wallet: WalletResponse) {
      walletFormValue.name = wallet.name;
      walletFormValue.id = wallet.id;
      isEdit.value = true;
    }
  },
  {
    name: 'Delete Wallet',
    icon: IconTrash,
    clickHandler(wallet: WalletResponse) {
      const d = dialog.error({
        title: `Delete the '${wallet.name}' Wallet?`,
        content:
          'You will also delete all transactios, categories and this action cannot be undone',

        negativeText: 'NO',
        positiveText: 'YES',
        positiveButtonProps: {
          color: '#ffffff',
          textColor: '#0012ff',
          size: 'large',
          themeOverrides: {
            fontSizeLarge: '16px',
            fontWeight: 'bold'
          }
        },
        negativeButtonProps: {
          color: '#ffffff',
          textColor: '#0012ff',
          size: 'large',
          themeOverrides: {
            fontSizeLarge: '16px',
            fontWeight: 'bold'
          }
        },
        async onPositiveClick() {
          d.loading = true;
          try {
            await deleteWalletById(wallet.id);
            message.success(`Delete the '${wallet.name}' wallet successful`);
            await loadMyWallets();
          } catch (err: any) {
            if (!!err.response) {
              message.error(err.response.data.message);
            } else {
              message.error(err.message);
            }
          }
          d.loading = false;
        }
      });
    }
  }
];

const addWallet = () => {
  formInstRef.value?.validate(async (error) => {
    if (!error) {
      loadingBar.start();
      try {
        await createNewWallet(walletFormValue);
        message.success('Create a new wallet successful');
        isAdd.value = false;
        await loadMyWallets();
      } catch (err: any) {
        if (!!err.response) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
        loadingBar.error();
      }
      loadingBar.finish();
    }
  });
};

const editWallet = () => {
  formInstRef.value?.validate(async (error) => {
    if (!error) {
      loadingBar.start();
      try {
        await editWalletName(walletFormValue);
        message.success('Edit this wallet successful');
        isEdit.value = false;
        await loadMyWallets();
      } catch (err: any) {
        if (!!err.response) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
        loadingBar.error();
      }
      loadingBar.finish();
    }
  });
};
</script>

<template>
  <p-header class="container" title="My Wallet">
    <template #function>
      <p
        @click="
          () => {
            isAdd = true;
            walletFormValue.name = '';
          }
        "
      >
        Add
      </p>
    </template>
  </p-header>

  <div id="wallet">
    <div v-for="wallet in myWallets" :key="wallet.id" class="wallet-item">
      <div class="wallet-img">
        <img width="50" height="50" src="@\assets\images\wallet.png" alt="" />
      </div>

      <div class="wallet-info">
        <h3>{{ wallet.name }}</h3>
        <span>{{ wallet.total }}$</span>
      </div>

      <div class="wallet-function">
        <n-space
          class="wf"
          v-for="(wf, i) in walletFunctions"
          :key="i"
          justify="center"
          align="center"
          @click="wf.clickHandler(wallet)"
        >
          <n-icon :size="28">
            <component :is="wf.icon" />
          </n-icon>
        </n-space>
      </div>
    </div>
  </div>

  <n-drawer :show="isAdd || isEdit" placement="bottom" height="100%">
    <div class="container">
      <p-header v-if="isAdd" title="Add Wallet">
        <template #function>
          <n-icon :size="28" @click="isAdd = false">
            <icon-x />
          </n-icon>
        </template>
      </p-header>
      <p-header v-else-if="isEdit" title="Edit Wallet">
        <template #function>
          <n-icon :size="28" @click="isEdit = false">
            <icon-x />
          </n-icon>
        </template>
      </p-header>

      <n-form ref="formInstRef" :model="walletFormValue" :rules="rules" class="wallet-form">
        <n-form-item path="name" :show-label="false">
          <div class="wallet-form-item">
            <div class="wallet-form-item-img">
              <img src="@\assets\images\wallet.png" width="50" height="50" alt="" />
            </div>
            <n-input
              :bordered="false"
              :theme-overrides="{
                fontSizeLarge: '24px'
              }"
              size="large"
              placeholder="Name"
              v-model:value="walletFormValue.name"
            />
          </div>
        </n-form-item>

        <p-button style="margin-top: 2rem" v-if="isAdd" @click="addWallet" attr-type="submit">
          Save
        </p-button>
        <p-button style="margin-top: 2rem" v-else @click="editWallet" attr-type="submit">
          Save
        </p-button>
      </n-form>
    </div>
  </n-drawer>
</template>

<style scoped lang="scss">
#wallet {
  margin: 2rem 0;
  background-color: #ffffff;
  .wallet-item {
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .wallet-img {
      border-radius: 50%;
      overflow: hidden;
      img {
      }
    }
    .wallet-info {
      margin-left: 2rem;
      flex: 1;
      span {
        color: $gray;
      }
    }
    .wallet-function {
      display: flex;
      > .wf {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        transition: all 0.3s ease-in-out;
        &:active {
          background: $gray;
        }
      }
    }
  }
}
.wallet-form {
  padding: 2rem 0;
  & &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      width: 100%;
    }
  }
}
</style>

<route lang="yaml">
name: Wallet
meta:
  requiresAuth: true
  layout: main
</route>
