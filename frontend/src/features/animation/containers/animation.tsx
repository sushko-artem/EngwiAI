import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import logo from "@assets/images/logo_project.webp";
import { useEffect, useState } from "react";

export const StartAnimation = () => {
  const [isAnimated, setIsAnimated] = useState(
    sessionStorage.getItem("isAnimationCompleted") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAnimated) {
      navigate("/dashboard");
    }
  }, [isAnimated, navigate]);

  const springs = useSpring({
    from: {
      transform: "scale(0)",
      filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
    },
    to: [
      {
        transform: "scale(1)",
        filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
      },
      {
        transform: "scale(1.05)",
        filter: "drop-shadow(6px 8px 3px rgba(0,0,0,0.7))",
        config: {
          tension: 280,
          friction: 6,
        },
      },
      {
        transform: "scale(0)",
        filter: "drop-shadow(6px 8px 3px rgba(0,0,0,0.7))",
      },
    ],
    config: {
      tension: 170,
      friction: 26,
    },
    delay: 200,
    onRest: () => {
      setIsAnimated(true);
      sessionStorage.setItem("isAnimationCompleted", "true");
      navigate("/dashboard");
    },
  });

  return <animated.img style={springs} src={logo} alt="logo" />;
};
