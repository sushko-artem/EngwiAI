import { EditableCard } from "@entities/editableCard";
import { useTransition, animated } from "@react-spring/web";
import {
  addCard,
  updateCollectionName,
} from "@features/collections/model/collections.slice";
import { useAppDispatch } from "@redux/hooks";
import { memo, useRef } from "react";

export type EditableCardType = {
  id: string;
  word: string;
  translation: string;
  isNew?: boolean;
  isUpdated?: boolean;
};

type EditableCollectionPropsType = {
  name: string;
  collection: EditableCardType[];
};

export const EditableCollection = memo(
  ({ name, collection }: EditableCollectionPropsType) => {
    const dispatch = useAppDispatch();
    const endRef = useRef<HTMLDivElement>(null);
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
        maxHeight: 200,
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

    console.log("COLLECTION");
    return (
      <div className="m-auto text-center grid gap-0.5 max-w-[500px] w-[70%] sm:w-[60%] md:w-[50%]">
        <div className="flex flex-col align-middle justify-center text-center my-4">
          <span className="mb-2 font-comic text-fuchsia-800 text-xl md:text-2xl">
            Имя коллекции:
          </span>
          <input
            value={name}
            onChange={(e) => dispatch(updateCollectionName(e.target.value))}
            autoComplete="off"
            name="name"
            type="text"
            className="self-center block w-[80%] border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto md:text-xl placeholder:font-jost placeholder:text-red-700/50"
          />
        </div>
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
        <div className="fixed bottom-4 right-4 z-50 lg:right-60">
          <div
            onClick={() => {
              dispatch(addCard());
              setTimeout(() => {
                endRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }, 200);
            }}
            className="flex justify-center items-center text-2xl rounded-[50%] text-white bg-blue-400 w-[50px] h-[50px] cursor-pointer hover:bg-blue-500 transition-all shadow-lg"
          >
            +
          </div>
        </div>
        <div ref={endRef} className="h-0 mt-8" />
      </div>
    );
  }
);
