import { Loader } from "@shared/ui/loader";
import { Header } from "@widgets/header";
import { EditableCollection } from "@widgets/editable-collection";
import { useCreateCollection } from "../lib";

export const CreateCollectionContainer = () => {
  const { isLoading, headerProps, collection } = useCreateCollection();

  return (
    <>
      <Header {...headerProps} />
      {collection ? (
        <EditableCollection
          collection={collection.cards}
          name={collection.name}
        />
      ) : (
        <div>Инициализация коллекции...</div>
      )}
      {isLoading && <Loader />}
    </>
  );
};
