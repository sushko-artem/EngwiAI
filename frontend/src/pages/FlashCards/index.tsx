import { useParams } from "react-router-dom";
import { FlashCardsContainer } from "@features/collections";

export const FlashCardsPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  return <FlashCardsContainer collectionId={collectionId} />;
};
