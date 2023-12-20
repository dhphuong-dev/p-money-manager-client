import type { CommonResponse } from './common.type';

export interface WalletResponse extends CommonResponse {
  name: string;
  total: number;
}
