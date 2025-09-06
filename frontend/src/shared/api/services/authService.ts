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
  getUser: (idOrEmail: string): Promise<IUser> =>
    apiClient.get(`${AUTH_ENDPOINTS.USER}${idOrEmail}`),
  register: (dto: IRegisterUserDto): Promise<IUser> =>
    apiClient.post<IUser>(AUTH_ENDPOINTS.REGISTER, dto),
  login: (dto: ILoginUserDto): Promise<IAuthResponse> =>
    apiClient.post(AUTH_ENDPOINTS.LOGIN, dto),
  logout: (): Promise<IAuthResponse> => apiClient.get(AUTH_ENDPOINTS.LOGOUT),
  refresh: (): Promise<IAuthResponse> => apiClient.get(AUTH_ENDPOINTS.REFRESH),
  googleAuth: (): void => {
    window.location.href = AUTH_ENDPOINTS.GOOGLE_AUTH;
  },
  getGoogleAuthSuccess: (): Promise<IUser> =>
    apiClient.get(AUTH_ENDPOINTS.GOOGLE_SUCCESS),
};
