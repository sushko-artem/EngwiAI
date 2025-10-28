import {
  api,
  AUTH_ENDPOINTS,
  type IAuthResponse,
  type ILoginUserDto,
  type IRegisterUserDto,
  type IUser,
} from "@shared/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<IUser, void>({
      query: () => AUTH_ENDPOINTS.ME,
      providesTags: ["User"],
    }),
    register: builder.mutation<IUser, IRegisterUserDto>({
      query: (dto) => ({
        url: AUTH_ENDPOINTS.REGISTER,
        method: "POST",
        body: dto,
      }),
    }),
    login: builder.mutation<IAuthResponse, ILoginUserDto>({
      query: (dto) => ({
        url: AUTH_ENDPOINTS.LOGIN,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["User"],
    }),
    logOut: builder.mutation<IAuthResponse, void>({
      query: () => AUTH_ENDPOINTS.LOGOUT,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogOutMutation,
} = authApi;
