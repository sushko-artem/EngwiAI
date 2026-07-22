import {
  NoCollectionError,
  NotASingleCollection,
} from "@entities/collection/ui";
import { Loader } from "@shared/ui/loader";
import { Header } from "@widgets/header";
import { useCollections } from "../lib";
import { CollectionsButtonsList } from "../ui";

export const CollectionsListContainer = () => {
  const { collections, isLoading, isRefetching, onDelete, error, headerProps } =
    useCollections();

  return (
    <>
      <Header {...headerProps} />
      {!collections && error && <NoCollectionError error={error} />}
      {collections?.length === 0 && <NotASingleCollection />}
      {collections && (
        <CollectionsButtonsList collections={collections} onDelete={onDelete} />
      )}
      {(isLoading || isRefetching) && <Loader />}
    </>
  );
};
