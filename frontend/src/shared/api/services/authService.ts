import { apiClient } from "@shared/api/client";
import { AUTH_ENDPOINTS } from "@shared/api/endpoints/auth";
import type {
  ILoginUserDto,
  IRegisterUserDto,
  IUser,
  IAuthResponse,
} from "@shared/api/types/auth";

export const authService = {
  getMe: (): Promise<IUser> => apiClient.get(AUTH_ENDPOINTS.ME),
  register: (dto: IRegisterUserDto): Promise<IUser> =>
    apiClient.post<IUser>(AUTH_ENDPOINTS.REGISTER, dto),
  login: (dto: ILoginUserDto): Promise<IAuthResponse> =>
    apiClient.post(AUTH_ENDPOINTS.LOGIN, dto),
  logout: (): Promise<IAuthResponse> => apiClient.post(AUTH_ENDPOINTS.LOGOUT),
  refresh: (): Promise<IAuthResponse> => apiClient.post(AUTH_ENDPOINTS.REFRESH),
};
