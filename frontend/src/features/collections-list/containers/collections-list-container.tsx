import { useMemo } from "react";
import {
  NoCollectionError,
  NotASingleCollection,
} from "@entities/collection/ui";
import { Loader } from "@shared/ui/loader";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useCollections } from "../lib";
import { CollectionsButtonsList } from "../ui";

export const CollectionsListContainer = () => {
  const { collections, isLoading, isRefetching, onDelete, error, handleBack } =
    useCollections();
  const headerProps = useMemo(
    () => ({
      title: "Мои модули",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: handleBack,
    }),
    [handleBack],
  );

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
