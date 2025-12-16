import { memo } from "react";
import { useTransition, animated } from "@react-spring/web";
import { EditableCard, type EditableCardType } from "@features/collections/ui";

type CardsListPropType = {
  collection: EditableCardType[];
};

export const CardsList = memo(({ collection }: CardsListPropType) => {
  const transitions = useTransition(collection, {
    keys: (item) => item.id,
    from: {
      opacity: 0,
      transform: "translateY(-20px) scale(0.95)",
      maxHeight: 0,
    },
    enter: {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
      maxHeight: 400,
    },
    leave: {
      opacity: 0,
      transform: "translateY(-20px) scale(0.7)",
      maxHeight: 0,
    },
    config: {
      tension: 200,
      friction: 25,
    },
  });

  return (
    <div className="flex flex-col gap-2 transition-all duration-300 ease-in-out">
      {transitions((style, item) => (
        <animated.div style={style}>
          <EditableCard
            word={item.word}
            translation={item.translation}
            key={item.id}
            id={item.id}
          />
        </animated.div>
      ))}
    </div>
  );
});
