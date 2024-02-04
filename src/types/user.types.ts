import type { UploadFileInfo } from 'naive-ui';
import type { CommonResponse } from './common.type';

export interface UserResponse extends CommonResponse {
  email: string;
  fullName: string;
  avatar: string;
  roleName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserUpdateRequest {
  email?: string;
  fullName?: string;
  avatar: UploadFileInfo[];
}
