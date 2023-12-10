import type { AxiosResponse } from 'axios';

import type { ILoginBody, IRegisterBody, UserLoginResponse } from '@/types/auth.types';
import type { APIResponse } from '@/types/response.type';
import { apiDefault } from '../axios';

const auth = () => ({
  async login(body: ILoginBody): Promise<AxiosResponse<APIResponse<UserLoginResponse>, any>> {
    return apiDefault.post<APIResponse<UserLoginResponse>>('login', body);
  },
  async register(body: IRegisterBody): Promise<AxiosResponse<any, any>> {
    return apiDefault.post('register', {
      fullName: body.fullName,
      email: body.email,
      password: body.password
    });
  },
  async resetPassword(email: string) {
    return apiDefault.post<
      APIResponse<{
        status: boolean;
        message: string;
      }>
    >('forgot-password', { email });
  }
});

export const { login, register, resetPassword } = auth();
