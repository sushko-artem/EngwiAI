import { apiClient } from "@shared/api/client";
import { AUTH_ENDPOINTS } from "@shared/api/endpoints/auth";
import type {
  ILoginUserDto,
  IRegisterUserDto,
  User,
  IAuthResponse,
} from "@shared/api/types/auth";

export const authService = {
  register: (dto: IRegisterUserDto): Promise<User> =>
    apiClient.post<User>(AUTH_ENDPOINTS.REGISTER, dto),
  login: (dto: ILoginUserDto): Promise<IAuthResponse> =>
    apiClient.post(AUTH_ENDPOINTS.LOGIN, dto),
};
