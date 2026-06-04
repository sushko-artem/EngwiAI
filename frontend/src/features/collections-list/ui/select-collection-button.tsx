import { memo, useCallback } from "react";
import { DeleteCross } from "@shared/ui/cross-delete";

type ActionButtonModulePropsType = {
  collectionName: string;
  id: string;
  onDelete(id: string): void;
  onClick(id: string): void;
};

export const SelectCollectionButton = memo(
  ({ collectionName, id, onDelete, onClick }: ActionButtonModulePropsType) => {
    const deleteHandler = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(id);
      },
      [onDelete, id]
    );
    return (
      <div
        onClick={() => onClick(id)}
        className="relative w-[70%] md:w-[40%] border-2 p-4 rounded-md cursor-pointer border-gray-500 hover:shadow-[5px_5px_7px_rgba(0,0,0,0.5)] hover:scale-[1.05] transition-all active:border-gray-400"
      >
        <DeleteCross onDelete={deleteHandler} />
        <span>{collectionName}</span>
      </div>
    );
  }
);
