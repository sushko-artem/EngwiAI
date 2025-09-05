export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
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
