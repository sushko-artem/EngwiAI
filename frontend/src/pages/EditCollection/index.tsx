import { useParams } from "react-router-dom";
import { EditCollectionContainer } from "@features/collections";

export const EditCollectionPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  return <EditCollectionContainer collectionId={collectionId} />;
};
