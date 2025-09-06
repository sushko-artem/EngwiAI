import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useEffect } from "react";
import { logout, setIsLoading, setUser } from "../model/auth.slice";
import { authService } from "@shared/api/services/authService";

export const useInitAuth = () => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  useEffect(() => {
    if (isInitialized) return;
    const initAuth = async () => {
      dispatch(setIsLoading(true));
      try {
        const user = await authService.getMe();
        dispatch(setUser(user));
      } catch (error) {
        if (error instanceof Error && error.cause === 401) {
          try {
            await authService.refresh();
            const user = await authService.getMe();
            dispatch(setUser(user));
          } catch (refreshError) {
            console.error(refreshError);
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    initAuth();
  }, [dispatch, isInitialized]);
};
