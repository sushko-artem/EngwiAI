import { memo, useRef } from "react";
import type { ICard } from "@shared/api";
import { CollectionName } from "./ui/collection-name";
import { CardsList } from "./ui/cards-list";
import { AddCardButton } from "./ui/add-card-button";
import { useEdit } from "./hooks/useEdit";

export type EditableCardType = ICard & {
  isNew?: boolean;
  isUpdated?: boolean;
};

type EditableCollectionPropsType = {
  name: string;
  collection: EditableCardType[];
};

export const EditableCollection = memo(
  ({ name, collection }: EditableCollectionPropsType) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { handleNameChange, handleAddCard } = useEdit(scrollRef);
    return (
      <div className="m-auto text-center grid gap-0.5 max-w-[500px] w-[70%] sm:w-[60%] md:w-[50%]">
        <CollectionName name={name} onChange={handleNameChange} />
        <CardsList collection={collection} />
        <AddCardButton onAdd={handleAddCard} />
        <div ref={scrollRef} className="h-0 mt-8" />
      </div>
    );
  }
);
