import { useCollections } from "@features/collections/hooks/useCollections";
import { Loader } from "@shared/ui/loader";
import { ActionButtonModule } from "./ui/action-button-module";

export const CollectionList = () => {
  const { collections, loading } = useCollections();

  return (
    <>
      {loading && <Loader />}
      <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-10 my-auto">
        {collections.map((item) => (
          <ActionButtonModule
            key={item.id}
            collectionName={item.name}
            id={item.id}
          />
        ))}
      </div>
    </>
  );
};
