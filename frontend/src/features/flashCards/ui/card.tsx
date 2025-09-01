import { memo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

type CardPropsType = {
  card: {
    term: string;
    translation: string;
  };
};

export const Card = memo(({ card }: CardPropsType) => {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <div className="flex justify-center items-center">
      <div
        onClick={() => setFlipped((state) => !state)}
        className="relative w-[350px] h-[200px] md:w-[500px] md:h-[300px]"
      >
        <animated.div
          className="card-container font-roboto text-lg md:text-2xl"
          style={{
            opacity: opacity.to((o) => 1 - o),
            transform,
          }}
        >
          {card.term}
        </animated.div>
        <animated.div
          className="card-container font-roboto text-lg md:text-2xl"
          style={{
            opacity,
            transform,
            rotateX: "180deg",
          }}
        >
          {card.translation}
        </animated.div>
      </div>
    </div>
  );
});
