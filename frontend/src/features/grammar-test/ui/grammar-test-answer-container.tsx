import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { SortableItem } from "./sortable-item";
import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { memo, useRef } from "react";

type GrammarTestAnswerContainerPropType = {
  words: { id: string; word: string }[] | undefined;
  handleDragEnd(event: DragEndEvent): void;
  handleAnswer(): void;
};

export const GrammarTestAnswerContainer = memo(
  ({
    words,
    handleDragEnd,
    handleAnswer,
  }: GrammarTestAnswerContainerPropType) => {
    const containerRef = useRef(null);
    return (
      <>
        <div className="mt-4 mb-4">
          <h2 className="font-jost text-fuchsia-700">
            Составьте предложение из данных слов:
          </h2>
          <DragDropProvider
            sensors={(defaults) => [
              ...defaults.filter((sensor) => sensor !== PointerSensor),
              PointerSensor.configure({
                activationConstraints: [
                  new PointerActivationConstraints.Distance({ value: 2 }),
                ],
              }),
            ]}
            modifiers={[
              RestrictToElement.configure({
                element: containerRef.current,
              }),
            ]}
            onDragEnd={handleDragEnd}
          >
            <div
              ref={containerRef}
              className="flex gap-1 justify-center flex-wrap text-xl lg:text-2xl font-roboto text-cyan-900 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]"
            >
              {words &&
                words.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    index={index}
                    word={item.word}
                  />
                ))}
            </div>
          </DragDropProvider>
        </div>
        <button
          data-testid="grammar-test-answer-button"
          onClick={handleAnswer}
          className="border-zinc-500 rounded-[5px] cursor-pointer border-2 p-2 mt-4 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all"
        >
          Ответить
        </button>
      </>
    );
  },
);
