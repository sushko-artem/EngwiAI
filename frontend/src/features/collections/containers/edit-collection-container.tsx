import {
  EditableCollection,
  NoCollectionError,
} from "@features/collections/ui";
import { Loader } from "@shared/ui/loader";
import { useEditCollection } from "@features/collections/hooks";
import { ModalConfirm } from "@widgets/modal-confirm";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { useMemo } from "react";
import { Header } from "@widgets/header";

export const EditCollectionContainer = ({
  collectionId,
}: {
  collectionId: string;
}) => {
  const {
    error,
    isLoading,
    modaleText,
    modaleMode,
    editableCollection,
    saveCollection,
    back,
    confirmAction,
  } = useEditCollection(collectionId);

  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться на главную",
      rightIconTitle: "сохранить",
      rightIconAction: saveCollection,
      leftIconAction: back,
      leftIcon: backArrow,
      rightIcon: isLoading ? undefined : save,
      title: isLoading ? "Сохранение..." : "Редактирование",
    }),
    [isLoading, saveCollection, back]
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
      {modaleMode && (
        <ModalConfirm mode={modaleMode} confirmAction={confirmAction}>
          {modaleText}
        </ModalConfirm>
      )}
    </>
  );
};
