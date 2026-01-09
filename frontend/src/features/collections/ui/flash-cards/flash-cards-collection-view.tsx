import type { ICollectionCardsResponse } from "@shared/api";
import { FlashCard } from "./flash-card";
import { memo } from "react";

type FlashCardsViewPropType = {
  collection: ICollectionCardsResponse;
  index: number;
  isReversed: boolean;
};

export const FlashCardsCollectionView = memo(
  ({ collection, index, isReversed }: FlashCardsViewPropType) => {
    return (
      <>
        <h1 className="text-center text-fuchsia-800 font-comic text-xl md:text-2xl mt-8">
          {collection.name}
        </h1>
        <div className="flex flex-col align-middle justify-center mt-10">
          <FlashCard card={collection.cards[index]} isReversed={isReversed} />
        </div>
      </>
    );
  }
);
