import type { APIResponse } from '@/types/response.type';
import type { ILoginBody, IRegisterBody, UserLoginResponse } from '@/types/auth.types';
import { ELocalStorage } from '@/constants';
import { login, register, resetPassword } from '@/api/auth';

interface IAuthState {
  acccesToken: string;
  returnUrl?: URL;
}

export const useAuthStore = defineStore('authStore', {
  state: (): IAuthState => {
    return {
      acccesToken: localStorage.getItem(ELocalStorage.ACCESS_TOKEN) || ''
    };
  },
  getters: {
    loggedIn: ({ acccesToken }): boolean => !!acccesToken
  },
  actions: {
    setUser(token: string) {
      this.acccesToken = token;
      localStorage.setItem(ELocalStorage.ACCESS_TOKEN, this.acccesToken);
    },
    clearUser() {
      this.acccesToken = '';
      localStorage.removeItem(ELocalStorage.ACCESS_TOKEN);
    },
    async login(user: ILoginBody): Promise<APIResponse<UserLoginResponse>> {
      try {
        const { data } = await login(user);
        this.acccesToken = data.data.accessToken;
        localStorage.setItem(ELocalStorage.ACCESS_TOKEN, this.acccesToken);
        return Promise.resolve(data);
      } catch (err: any) {
        return Promise.reject(err.response.data);
      }
    },
    async register(user: IRegisterBody): Promise<APIResponse<any>> {
      try {
        const { data } = await register(user);
        return Promise.resolve(data);
      } catch (err: any) {
        return Promise.reject(err.response.data);
      }
    },
    async logout() {
      this.acccesToken = '';
      localStorage.removeItem(ELocalStorage.ACCESS_TOKEN);
    }
  }
});
