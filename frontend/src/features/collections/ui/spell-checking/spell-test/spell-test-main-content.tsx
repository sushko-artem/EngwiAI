import type { ICard } from "@shared/api";
import { Progress } from "@shared/ui/progress";
import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

type SpellTestMainContentPropType = {
  collection: ICard[];
  index: number;
  visibleSide: "word" | "translation";
  onAnswer(answer: string, originalValue: string): void;
};

export const SpellTestMainContent = ({
  collection,
  index,
  onAnswer,
  visibleSide,
}: SpellTestMainContentPropType) => {
  const answerRef = useRef<HTMLTextAreaElement>(null);

  const originalValue = visibleSide === "word" ? "translation" : "word";

  const handleAnswer = () => {
    const userAnswer = answerRef.current?.value || "";
    onAnswer(userAnswer, collection[index][originalValue]!);
  };

  return (
    <div className="m-auto text-center w-[80%] md:w-[60%] lg:w-[50%]">
      <div className="text-xl lg:text-2xl font-roboto text-cyan-900 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]">
        {collection[index][visibleSide]}
      </div>
      <div className="mt-2">
        <Progress
          className="bg-transparent"
          value={((index + 1) / collection.length) * 100}
        />
        <span className="text-xs font-comic font-bold text-zinc-500">
          {index + 1}/{collection.length}
        </span>
      </div>
      <div className="mt-4 mb-4">
        <span className="font-jost text-fuchsia-700">Ваш ответ:</span>
        <TextareaAutosize
          key={index}
          ref={answerRef}
          autoFocus
          className="p-2 border-1 border-[#d34af1] rounded-[5px] outline-0 text-center focus:border-2 font-roboto w-full resize-none overflow-y-auto bg-[rgba(255,241,228,0.8)] lg:text-xl"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(233,220,230,0.2) transparent",
            scrollbarGutter: "stable",
          }}
          minRows={1}
          maxRows={4}
          maxLength={250}
          autoComplete="off"
        />
        <span className="text-xs block leading-3 text-zinc-700">
          ответ должен соответствовать содержимому, указанному в&nbsp;карточке
        </span>
      </div>
      <button
        onClick={handleAnswer}
        className="border-zinc-500 rounded-[5px] cursor-pointer border-2 p-2 mt-4 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all"
      >
        Ответить
      </button>
    </div>
  );
};
