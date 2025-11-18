import { memo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import type { ICard } from "@shared/api";

type CardPropsType = {
  isReversed: boolean;
  card: Omit<ICard, "id">;
};

export const FlashCard = memo(({ card, isReversed }: CardPropsType) => {
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
          {isReversed ? card.translation : card.word}
        </animated.div>
        <animated.div
          className="card-container font-roboto text-lg md:text-2xl"
          style={{
            opacity,
            transform,
            rotateX: "180deg",
          }}
        >
          {isReversed ? card.word : card.translation}
        </animated.div>
      </div>
    </div>
  );
});
