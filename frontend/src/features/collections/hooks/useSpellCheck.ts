import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useSpellCheck = () => {
  const navigate = useNavigate();

  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return {
    back,
  };
};
