import { memo, useRef } from "react";

import {
  CollectionName,
  CardsList,
  AddCardButton,
} from "@entities/collection/ui";
import { useEdit } from "../lib/hooks/useEdit";
import type { EditableCardType } from "@entities/collection/types";

type EditableCollectionPropsType = {
  name: string;
  collection: EditableCardType[];
};

export const EditableCollection = memo(
  ({ name, collection }: EditableCollectionPropsType) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { handleNameChange, handleAddCard } = useEdit(scrollRef);
    return (
      <div
        data-testid="editable-collection"
        className="m-auto text-center grid gap-0.5 max-w-[500px] w-[70%] sm:w-[60%] md:w-[50%]"
      >
        <CollectionName name={name} onChange={handleNameChange} />
        <CardsList collection={collection} />
        <AddCardButton onAdd={handleAddCard} />
        <div ref={scrollRef} className="h-0 mt-8" />
      </div>
    );
  },
);
