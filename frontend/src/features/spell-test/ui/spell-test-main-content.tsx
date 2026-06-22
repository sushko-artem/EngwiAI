import type { ICard } from "@shared/api";
import { Progress } from "@shared/ui/progress";
import { memo, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import type { SoundNameType } from "shared/constants/sounds";

type SpellTestMainContentPropType = {
  collection: ICard[];
  index: number;
  inProgress: boolean;
  visibleSide: "word" | "translation";
  onAnswer(userAnswer: string, correctAnswer: string): SoundNameType;
};

export const SpellTestMainContent = memo(
  ({
    collection,
    index,
    onAnswer,
    visibleSide,
    inProgress,
  }: SpellTestMainContentPropType) => {
    const answerRef = useRef<HTMLTextAreaElement>(null);
    const [borderType, setBorderType] = useState<SoundNameType | null>(null);
    const originalValue = visibleSide === "word" ? "translation" : "word";

    useEffect(() => {
      setBorderType(null);
    }, [index]);

    const handleAnswer = () => {
      const userAnswer = answerRef.current?.value || "";
      const correctAnswer = collection[index][originalValue]!;
      const status = onAnswer(userAnswer, correctAnswer);
      setBorderType(status);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAnswer();
      }
    };

    const borderColorClass =
      borderType === "correct"
        ? "border-green-500 focus:border-green-600"
        : borderType === "incorrect"
          ? "border-red-500 focus:border-red-600"
          : "border-[#e5e7eb] focus:border-[#e5e7eb]";

    return (
      <div className="m-auto text-center w-[80%] md:w-[60%] lg:w-[50%]">
        <div
          data-testid="test-termin"
          className="text-xl lg:text-2xl font-roboto text-cyan-900 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]"
        >
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
            data-testid="user-answer-textarea"
            disabled={!inProgress}
            autoFocus
            onKeyDown={handleKeyDown}
            ref={answerRef}
            className={`p-2 border-1 rounded-[5px] outline-0 text-center focus:border-2 font-roboto w-full resize-none overflow-y-auto bg-[rgba(255,241,228,0.8)] lg:text-xl transition-colors duration-300 ${borderColorClass}`}
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

          <span className="text-zinc-700 block leading-3 text-xs">
            (Enter - ответить, Shift+Enter - новая&nbsp;строка)
          </span>
        </div>
        <button
          data-testid="spell-test-answer-button"
          onClick={handleAnswer}
          className="border-zinc-500 rounded-[5px] cursor-pointer border-2 p-2 mt-4 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all"
        >
          Ответить
        </button>
      </div>
    );
  },
);
