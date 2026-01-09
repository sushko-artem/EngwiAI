import { useNavigate } from "react-router-dom";
import type { ICollectionResponse } from "@shared/api";
import { SelectCollectionButton } from "..";
import { memo, useCallback } from "react";

type CollectionsButtonsListPropType = {
  collections: ICollectionResponse[];
  onDelete(id: string): void;
};

export const CollectionsButtonsList = memo(
  ({ collections, onDelete }: CollectionsButtonsListPropType) => {
    const navigate = useNavigate();

    const handleClick = useCallback(
      (id: string) => {
        navigate(`/flash-cards/${id}`);
      },
      [navigate]
    );

    const handleDelete = useCallback(
      (id: string) => {
        onDelete(id);
      },
      [onDelete]
    );

    return (
      <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-10 my-auto">
        {collections!.map((item) => (
          <SelectCollectionButton
            key={item.id}
            collectionName={item.name}
            id={item.id}
            onDelete={handleDelete}
            onClick={handleClick}
          />
        ))}
      </div>
    );
  }
);
