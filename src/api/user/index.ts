import { api } from '../axios';
import type { APIResponse } from '@/types/response.type';
import type { UserResponse } from '@/types/user.types';
import { UrlConstants } from '@/constants';

const user = () => ({
  async getMyAccount() {
    return api.get<APIResponse<UserResponse>>(UrlConstants.USER + '/me');
  }
});

export const { getMyAccount } = user();
