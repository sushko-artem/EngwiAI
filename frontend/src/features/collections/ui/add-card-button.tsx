import { memo } from "react";

type AddCardButtonPropType = {
  onAdd(): void;
};

export const AddCardButton = memo(({ onAdd }: AddCardButtonPropType) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 lg:right-60">
      <div
        onClick={onAdd}
        className="flex justify-center items-center text-2xl rounded-[50%] text-white bg-blue-400 w-[50px] h-[50px] cursor-pointer hover:bg-blue-500 transition-all shadow-lg"
      >
        +
      </div>
    </div>
  );
});
