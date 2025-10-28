import { useParams } from "react-router-dom";
import { EditCollection } from "@features/collections";

export const EditCollectionPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  return <EditCollection collectionId={collectionId} />;
};
