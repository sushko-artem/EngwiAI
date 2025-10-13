import { FlashCardsContainer } from "@features/collections/containers/flash-cards/flash-cards-container";
import { useParams } from "react-router-dom";

export const FlashCardsPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  return <FlashCardsContainer collectionId={collectionId} />;
};
