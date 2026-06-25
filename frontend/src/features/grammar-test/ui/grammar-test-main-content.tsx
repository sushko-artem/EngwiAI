import { Progress } from "@shared/ui/progress";
import type { GrammarDataType } from "../lib/helpers";
import type { SoundNameType } from "@shared/constants/sounds";
import { GrammarTestDnD } from "./grammar-test-dnd";
import { useCallback, useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/react";

type GrammarTestContentPropType = {
  index: number;
  sentences: GrammarDataType;
  onAnswer(userAnswer: string, correctAnswer: string): SoundNameType;
};

export const GrammarTestContent = ({
  index,
  sentences,
  onAnswer,
}: GrammarTestContentPropType) => {
  const [items, setItems] = useState<Array<{ id: string; text: string }>>([]);

  useEffect(() => {
    setItems(
      sentences.shuffledSentences[index].map((word, i) => ({
        id: `word-${i}-${word}`,
        text: word,
      })),
    );
  }, [sentences, index]);

  const handleAnswer = () => {
    const userAnswer = items.map((item) => item.text).join(" ");
    console.log(userAnswer);
    onAnswer(userAnswer, sentences.joinedSentences[index]);
  };
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { operation } = event;

    if (operation.source && operation.target) {
      const sourceId = operation.source.id;
      const targetId = operation.target.id;

      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === sourceId);
        const newIndex = prevItems.findIndex((item) => item.id === targetId);

        if (oldIndex === -1 || newIndex === -1) return prevItems;

        const newItems = [...prevItems];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return newItems;
      });
    }
  }, []);

  return (
    <div className="m-auto text-center w-[80%] md:w-[60%] lg:w-[50%]">
      <div
        data-testid="test-sentence"
        className="text-xl lg:text-2xl font-roboto text-cyan-900 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]"
      >
        {sentences.translations[index]}
      </div>
      <div className="mt-2">
        <Progress
          className="bg-transparent"
          value={((index + 1) / sentences.translations.length) * 100}
        />
        <span className="text-xs font-comic font-bold text-zinc-500">
          {index + 1}/{sentences.translations.length}
        </span>
      </div>
      <div className="mt-4 mb-4">
        <span className="font-jost text-fuchsia-700">
          Составьте предложение из данных слов:
        </span>
        <GrammarTestDnD words={items} handleDragEnd={handleDragEnd} />
      </div>
      <button
        data-testid="grammar-test-answer-button"
        onClick={handleAnswer}
        className="border-zinc-500 rounded-[5px] cursor-pointer border-2 p-2 mt-4 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all"
      >
        Ответить
      </button>
    </div>
  );
};
