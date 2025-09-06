export interface IUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  crearedAt?: string;
  updatedAt?: string;
}

export interface IRegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUserDto {
  email: string;
  password: string;
}

export interface IAuthResponse {
  message: string;
}
