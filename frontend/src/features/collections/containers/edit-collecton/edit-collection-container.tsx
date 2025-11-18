import { memo } from "react";
import { EditableCollection } from "@widgets/editableCollection";
import { Loader } from "@shared/ui/loader";
import {
  NotFoundCollection,
  type EditableCollectionType,
} from "@features/collections";

interface IEditCollectionContainerProps {
  isLoading: boolean;
  collection: EditableCollectionType;
  error: unknown;
}

export const EditCollectionContainer = memo(
  ({ isLoading, collection, error }: IEditCollectionContainerProps) => {
    if (!collection && !error) {
      return <Loader />;
    }
    return (
      <>
        {isLoading && <Loader />}
        {error && <NotFoundCollection error={error} />}
        <EditableCollection
          name={collection.name}
          collection={collection.cards}
        />
      </>
    );
  }
);
