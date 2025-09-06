import { useAppDispatch } from "@redux/hooks";
import { setUser, logout } from "@features/auth/model/auth.slice";
import type { ILoginUserDto, IRegisterUserDto } from "@shared/api/index";
import { authService } from "@shared/api/services/authService";
import { useCallback, useState } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const register = useCallback(
    async (dto: IRegisterUserDto) => {
      setLoading(true);
      setError(null);
      try {
        const user = await authService.register(dto);
        dispatch(setUser(user));
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Ошибка регистрации";
        const cause = err instanceof Error ? err.cause : null;
        setError(message);
        return { success: false, error: message, cause };
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const logIn = useCallback(
    async (dto: ILoginUserDto) => {
      setLoading(true);
      setError(null);
      try {
        await authService.login(dto);
        const user = await authService.getUser(dto.email);
        dispatch(setUser(user));
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Ошибка входа";
        const cause = err instanceof Error ? err.cause : null;
        setError(message);
        return { success: false, error: message, cause };
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const logOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      dispatch(logout());
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { loading, error, register, logIn, logOut };
};
