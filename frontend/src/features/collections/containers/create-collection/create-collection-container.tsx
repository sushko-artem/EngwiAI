import {
  selectEditableCollection,
  useCreateCollection,
} from "@features/collections";
import { Loader } from "@shared/ui/loader";
import { EditableCollection } from "@widgets/editableCollection";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { ModalConfirm } from "@widgets/modal-confirm";
import { useMemo } from "react";
import { useAppSelector } from "@redux/hooks";
import { Header } from "@widgets/header";

export const CreateCollectionContainer = () => {
  const collection = useAppSelector(selectEditableCollection);
  const {
    isLoading,
    modaleMode,
    modaleText,
    saveCollection,
    back,
    confirmAction,
  } = useCreateCollection(collection);

  const headerProps = useMemo(
    () => ({
      title: isLoading ? "Сохранение..." : "Новая коллекция",
      leftIconTitle: "вернуться на главную",
      rightIconTitle: "сохранить",
      rightIconAction: saveCollection,
      leftIconAction: back,
      leftIcon: backArrow,
      rightIcon: isLoading ? undefined : save,
    }),
    [isLoading, saveCollection, back]
  );

  if (!collection) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      <Header {...headerProps} />
      <EditableCollection
        collection={collection.cards}
        name={collection.name}
      />
      {modaleMode && (
        <ModalConfirm confirmAction={confirmAction} mode={modaleMode}>
          {modaleText}
        </ModalConfirm>
      )}
    </>
  );
};
