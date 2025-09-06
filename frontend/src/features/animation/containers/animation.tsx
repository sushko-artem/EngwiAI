import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import logo from "@assets/images/logo_project.webp";
import { useEffect, useState } from "react";
import { useAppSelector } from "@redux/hooks";
import { useInitAuth } from "@features/auth/hooks/useInitAuth";

export const StartAnimation = () => {
  const [isAnimated, setIsAnimated] = useState(
    sessionStorage.getItem("isAnimationCompleted") === "true"
  );
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useInitAuth();

  useEffect(() => {
    if (isAnimated) {
      navigate(isAuthenticated ? "/dashboard" : "/sign-in", { replace: true });
    }
  }, [isAnimated, navigate, isAuthenticated]);

  const springs = useSpring({
    from: {
      transform: "scale(0)",
      filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
    },
    to: async (next) => {
      await next({
        transform: "scale(1)",
        filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
      });
      await next({
        transform: "scale(1.05)",
        filter: "drop-shadow(6px 8px 3px rgba(0,0,0,0.7))",
        config: { tension: 280, friction: 6 },
      });
      await next({
        transform: "scale(0)",
        filter: "drop-shadow(6px 8px 3px rgba(0,0,0,0.7))",
      });
      setIsAnimated(true);
      sessionStorage.setItem("isAnimationCompleted", "true");
      navigate(isAuthenticated ? "/dashboard" : "/sign-in", { replace: true });
    },
    config: {
      tension: 170,
      friction: 26,
    },
    delay: 200,
  });

  if (isAnimated) {
    return null;
  }

  return <animated.img style={springs} src={logo} alt="logo" />;
};
