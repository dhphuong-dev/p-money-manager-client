import { api } from '../axios';
import type { APIResponse } from '@/types/response.type';
import type { WalletResponse } from '@/types/wallet.type';
import { UrlConstants } from '@/constants';

const wallet = () => ({
  async getMyWallet() {
    return api.get<APIResponse<WalletResponse[]>>(UrlConstants.WALLET + '/me');
  },
  async getWalletById(id: string) {
    return api.get<APIResponse<WalletResponse>>(UrlConstants.WALLET, { params: { id } });
  }
});

export const { getMyWallet, getWalletById } = wallet();
