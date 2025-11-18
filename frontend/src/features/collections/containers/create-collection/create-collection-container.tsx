import type { EditableCollectionType } from "@features/collections";
import { Loader } from "@shared/ui/loader";
import { EditableCollection } from "@widgets/editableCollection";
import { memo } from "react";

type CreateCollectionPropType = {
  isLoading: boolean;
  collection: EditableCollectionType;
};

export const CreateCollectionContainer = memo(
  ({ isLoading, collection }: CreateCollectionPropType) => {
    if (!collection) {
      return <Loader />;
    }
    return (
      <>
        {isLoading && <Loader />}
        <EditableCollection
          collection={collection.cards}
          name={collection.name}
        />
      </>
    );
  }
);
