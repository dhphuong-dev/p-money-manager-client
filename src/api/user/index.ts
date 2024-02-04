import { api } from '../axios';
import type { APIResponse } from '@/types/response.type';
import type { ChangePasswordRequest, UserResponse, UserUpdateRequest } from '@/types/user.types';
import { UrlConstants } from '@/constants';

const user = () => ({
  async getMyAccount() {
    return api.get<APIResponse<UserResponse>>(UrlConstants.USER + '/me');
  },
  async changePassword(request: ChangePasswordRequest) {
    return api.post<APIResponse<{ status: boolean; message: string }>>(
      UrlConstants.USER + '/change-password',
      request
    );
  },
  async updateUser(request: UserUpdateRequest) {
    const formData = new FormData();

    Object.keys(request).forEach((key) => {
      if (key !== ('avatar' as keyof UserUpdateRequest)) formData.append(key, request[key]);
    });
    request.avatar.length > 0 &&
      formData.append('avatar' as keyof UserUpdateRequest, request.avatar[0].file as File);

    return api.patchForm(UrlConstants.USER, formData);
  }
});

export const { getMyAccount, changePassword, updateUser } = user();
