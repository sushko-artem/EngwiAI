import { useSortable } from "@dnd-kit/react/sortable";

type SortableItemPropType = {
  id: string;
  index: number;
  word: string;
};

export const SortableItem = ({ id, index, word }: SortableItemPropType) => {
  const { ref, isDragging } = useSortable({ id, index });
  return (
    <div
      ref={ref}
      className={`border-2 border-gray-400 bg-[rgba(255,241,228,1)] rounded-[5px] p-2 text-center transition-transform cursor-grab ${
        isDragging
          ? "scale-103 shadow-[4px_4px_6px_rgba(0,0,0,0.5)]"
          : "scale-100"
      }`}
    >
      {word}
    </div>
  );
};
