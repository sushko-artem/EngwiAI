import { useSpring, animated } from "@react-spring/web";
import logo from "@assets/images/logo_project.webp";
import { useAnimation } from "..";

export const StartAnimationContainer = () => {
  const { isAnimated, completeAnimation } = useAnimation();
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
      completeAnimation();
    },
    config: {
      tension: 170,
      friction: 26,
    },
    delay: 200,
  });

  if (isAnimated) return null;

  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <div className="lg:w-[300px] md:w-[230px] w-[180px]">
        <animated.img style={springs} src={logo} alt="logo" />
      </div>
    </div>
  );
};
