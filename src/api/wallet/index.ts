import { api } from '../axios';
import type { APIResponse } from '@/types/response.type';
import type { WalletResponse } from '@/types/wallet.type';
import { UrlConstants } from '@/constants';

const wallet = () => ({
  async getWallet() {
    return api.get<APIResponse<WalletResponse[]>>(UrlConstants.WALLET);
  }
});

export const { getWallet } = wallet();
