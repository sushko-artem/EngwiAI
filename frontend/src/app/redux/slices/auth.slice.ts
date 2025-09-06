import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "@shared/api/types/auth";

interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser, setAuth, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
