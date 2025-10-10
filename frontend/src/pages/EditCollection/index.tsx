import { EditCollection } from "@features/collections/containers/edit-collecton";
import { useParams } from "react-router-dom";

export const EditCollectionPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  return <EditCollection collectionId={collectionId} />;
};
