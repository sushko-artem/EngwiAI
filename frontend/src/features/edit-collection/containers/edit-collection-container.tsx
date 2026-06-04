import { NoCollectionError } from "@entities/collection/ui";
import { Loader } from "@shared/ui/loader";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { useCallback, useMemo } from "react";
import { Header } from "@widgets/header";
import { useNavigate } from "react-router-dom";
import { EditableCollection } from "@widgets/editable-collection";
import { useEditCollection } from "../lib";

export const EditCollectionContainer = ({
  collectionId,
}: {
  collectionId: string;
}) => {
  const { error, isSaving, editableCollection, saveCollection } =
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
      rightIcon: isSaving || error ? undefined : save,
      title: isSaving ? "Сохранение..." : "Редактирование",
    }),
    [isSaving, error, saveCollection, handleBack],
  );

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
      {isSaving && <Loader />}
    </>
  );
};
