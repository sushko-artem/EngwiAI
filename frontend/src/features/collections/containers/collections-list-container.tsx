import { useCallback, useMemo } from "react";
import {
  CollectionsButtonsList,
  NoCollectionError,
  NotASingleCollection,
} from "@features/collections/ui";
import { Loader } from "@shared/ui/loader";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useCollections } from "@features/collections/hooks";
import { useNavigate } from "react-router-dom";

export const CollectionsListContainer = () => {
  const { collections, isLoading, isRefetching, onDelete, error } =
    useCollections();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

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
      {(isLoading || isRefetching) && <Loader />}
      {!collections && error && <NoCollectionError error={error} />}
      {collections?.length === 0 && <NotASingleCollection />}
      {collections && (
        <CollectionsButtonsList collections={collections} onDelete={onDelete} />
      )}
    </>
  );
};
