import { useParams } from "react-router-dom";
import { FlashCardsContainer } from "@features/collections";
import { useState } from "react";

export const FlashCardsPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  const [resetKey, setResetKey] = useState(0);

  const resetModule = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <FlashCardsContainer
      key={resetKey}
      collectionId={collectionId}
      reset={resetModule}
    />
  );
};
