import { useCallback, useMemo } from "react";
import { useAppSelector } from "@redux/hooks";
import { selectEditableCollection } from "@features/collections/model";
import { useCreateCollection } from "@features/collections/hooks";
import { Loader } from "@shared/ui/loader";
import { EditableCollection } from "@features/collections/ui";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { Header } from "@widgets/header";
import { useNavigate } from "react-router-dom";

export const CreateCollectionContainer = () => {
  const collection = useAppSelector(selectEditableCollection);
  const { isSaving, saveCollection } = useCreateCollection(collection);
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const headerProps = useMemo(
    () => ({
      title: isSaving ? "Сохранение..." : "Новая коллекция",
      leftIconTitle: "вернуться на главную",
      rightIconTitle: "сохранить",
      rightIconAction: saveCollection,
      leftIconAction: handleBack,
      leftIcon: backArrow,
      rightIcon: isSaving ? undefined : save,
    }),
    [isSaving, saveCollection, handleBack],
  );

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
      {isSaving && <Loader />}
    </>
  );
};
