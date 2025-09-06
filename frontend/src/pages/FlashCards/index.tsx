import { FlashCardsContainer } from "@features/flashCardsCollection";
import { useParams } from "react-router-dom";

export const FlashCardsPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  return <FlashCardsContainer collectionId={collectionId} />;
};
