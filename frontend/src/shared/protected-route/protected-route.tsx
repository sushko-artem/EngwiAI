import { useInitAuth } from "@features/auth/hooks/useInitAuth";
import { useAppSelector } from "@redux/hooks";
import { Loader } from "@shared/ui/loader";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  useInitAuth();

  if (!isInitialized || isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
};
