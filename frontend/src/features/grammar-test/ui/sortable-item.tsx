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
      className={`border-2 rounded-[5px] p-2 text-center transition-transform ${
        isDragging ? "scale-105 opacity-80 shadow-lg" : "scale-100"
      }`}
    >
      {word}
    </div>
  );
};
