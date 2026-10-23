import { memo } from "react";

type AddCardButtonPropType = {
  onAdd(): void;
};

export const AddCardButton = memo(({ onAdd }: AddCardButtonPropType) => {
  return (
    <div className="fixed bottom-4 right-4 md:right-20 lg:right-80">
      <button
        data-testid="add-card-button"
        onClick={onAdd}
        className="flex justify-center items-center text-2xl rounded-[50%] text-white bg-blue-400 w-12.5 h-12.5 cursor-pointer hover:bg-blue-500 transition-all shadow-lg"
      >
        +
      </button>
    </div>
  );
});
