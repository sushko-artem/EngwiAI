import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { memo } from "react";
import { SortableItem } from "./sortable-item";

type GrammarTetsDnDPropType = {
  words: { id: string; text: string }[];
  handleDragEnd(event: DragEndEvent): void;
};

export const GrammarTestDnD = memo(
  ({ words, handleDragEnd }: GrammarTetsDnDPropType) => {
    return (
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="text-xl lg:text-2xl font-roboto text-cyan-900 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]">
          {words.map((word, index) => (
            <SortableItem
              key={word.id}
              id={word.id}
              index={index}
              word={word.text}
            />
          ))}
        </div>
      </DragDropProvider>
    );
  },
);
