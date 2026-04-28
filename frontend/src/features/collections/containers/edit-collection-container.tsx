import {
  EditableCollection,
  NoCollectionError,
} from "@features/collections/ui";
import { Loader } from "@shared/ui/loader";
import { useEditCollection } from "@features/collections/hooks";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { useCallback, useMemo } from "react";
import { Header } from "@widgets/header";
import { useNavigate } from "react-router-dom";

export const EditCollectionContainer = ({
  collectionId,
}: {
  collectionId: string;
}) => {
  const { error, isLoading, editableCollection, saveCollection } =
    useEditCollection(collectionId);
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/collections");
  }, [navigate]);

  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться на главную",
      rightIconTitle: "сохранить",
      rightIconAction: saveCollection,
      leftIconAction: handleBack,
      leftIcon: backArrow,
      rightIcon: isLoading || error ? undefined : save,
      title: isLoading ? "Сохранение..." : "Редактирование",
    }),
    [isLoading, error, saveCollection, handleBack],
  );

  if (!editableCollection && !error) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      <Header {...headerProps} />
      {error ? (
        <NoCollectionError error={error} />
      ) : (
        <EditableCollection
          name={editableCollection!.name}
          collection={editableCollection!.cards}
        />
      )}
    </>
  );
};
