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
  },
  async createNewWallet(wallet: { name: string }) {
    return api.post<APIResponse<WalletResponse>>(UrlConstants.WALLET, wallet);
  },
  async editWalletName({ id, name }: { id?: string; name: string }) {
    return api.post<APIResponse<WalletResponse>>(`${UrlConstants.WALLET}/update-name/${id}`, null, {
      params: { name }
    });
  },
  async deleteWalletById(id: string) {
    return api.delete(`${UrlConstants.WALLET}/${id}`);
  }
});

export const { getMyWallet, getWalletById, createNewWallet, editWalletName, deleteWalletById } =
  wallet();
