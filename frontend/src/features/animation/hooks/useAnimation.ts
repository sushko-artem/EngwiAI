import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useGetMeQuery } from "@features/auth";

export const useAnimation = () => {
  const navigate = useNavigate();
  const [isAnimated, setIsAnimated] = useState(
    sessionStorage.getItem("isAnimationCompleted") === "true"
  );
  const { data: user, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (isAnimated && !isLoading) {
      navigate(user ? "/dashboard" : "/sign-in", { replace: true });
    }
  }, [isAnimated, navigate, user, isLoading]);

  const completeAnimation = useCallback(() => {
    setIsAnimated(true);
    sessionStorage.setItem("isAnimationCompleted", "true");
    navigate(user ? "/dashboard" : "/sign-in", { replace: true });
  }, [navigate, user]);

  return {
    isAnimated,
    completeAnimation,
  };
};
