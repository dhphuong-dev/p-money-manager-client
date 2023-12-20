interface ILoginBody {
  email: string;
  password: string;
}

interface UserLoginResponse {
  tokenType: string;
  accessToken: string;
  refreshToken?: string;
  id: string;
  authorities: {
    authority: string;
  }[];
}

interface IRegisterBody {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type { ILoginBody, IRegisterBody, UserLoginResponse };
