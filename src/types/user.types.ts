import type { CommonResponse } from './common.type';

export interface UserResponse extends CommonResponse {
  email: string;
  fullName: string;
  avatar: string;
  roleName: string;
}
