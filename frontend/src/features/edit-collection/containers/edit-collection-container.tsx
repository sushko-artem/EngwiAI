import { NoCollectionError } from "@entities/collection/ui";
import { Loader } from "@shared/ui/loader";
import { Header } from "@widgets/header";
import { EditableCollection } from "@widgets/editable-collection";
import { useEditCollection } from "../lib";

export const EditCollectionContainer = () => {
  const { error, isLoading, editableCollection, headerProps } =
    useEditCollection();

  return (
    <>
      <Header {...headerProps} />
      {editableCollection ? (
        <EditableCollection
          name={editableCollection.name}
          collection={editableCollection.cards}
        />
      ) : error ? (
        <NoCollectionError error={error} />
      ) : (
        <div>Загрузка...</div>
      )}
      {isLoading && <Loader />}
    </>
  );
};
