import { useGetMeQuery } from "@features/auth";
import { getErrorMessage, isFetchBaseQueryError } from "@shared/api";
import { Loader } from "@shared/ui/loader";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, error } = useGetMeQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      if (
        isFetchBaseQueryError(error) &&
        getErrorMessage(error) === "Refresh token not found"
      )
        navigate("/sign-in");
    }
  }, [error, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return user ? children : <Navigate to="/sign-in" replace />;
};
