import { memo } from "react";
import cross from "@assets/images/cross.webp";

type DeleteCrossPropType = {
  onDelete(e: React.MouseEvent): void;
};

export const DeleteCross = memo(({ onDelete }: DeleteCrossPropType) => {
  return (
    <div className="absolute w-[18px] right-1.5 top-1.5 hover:scale-[1.2] cursor-pointer transition-all">
      <img
        data-testid="deleteCross"
        onClick={onDelete}
        width={100}
        src={cross}
        alt="delete"
        title="удалить"
      />
    </div>
  );
});
