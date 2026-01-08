import { useMemo } from "react";
import {
  CollectionsButtonsList,
  NoCollectionError,
  NotASingleCollection,
} from "@features/collections/ui";
import { Loader } from "@shared/ui/loader";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useCollections } from "@features/collections/hooks";

export const CollectionsListContainer = () => {
  const { collections, isLoading, isRefetching, onDelete, back, error } =
    useCollections();

  const headerProps = useMemo(
    () => ({
      title: "Мои модули",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: back,
    }),
    [back]
  );

  return (
    <>
      <Header {...headerProps} />
      {(isLoading || isRefetching) && <Loader />}
      {!collections && error && <NoCollectionError error={error} />}
      {collections?.length === 0 && <NotASingleCollection />}
      {collections && (
        <CollectionsButtonsList collections={collections} onDelete={onDelete} />
      )}
    </>
  );
};
