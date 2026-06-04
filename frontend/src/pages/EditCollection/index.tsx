import { EditCollectionContainer } from "@features/edit-collection";
import { useParams } from "react-router-dom";

export const EditCollectionPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  return <EditCollectionContainer collectionId={collectionId} />;
};
