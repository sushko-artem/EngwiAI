import { useParams } from "react-router-dom";
import {
  EditCollectionContainer,
  useEditCollection,
} from "@features/collections";
import { Layout } from "@widgets/layout";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { ModalConfirm } from "@widgets/modal-confirm";

export const EditCollectionPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
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
  return (
    <Layout
      headerProps={{
        leftIconTitle: "вернуться на главную",
        rightIconTitle: "сохранить",
        rightIconAction: saveCollection,
        leftIconAction: back,
        leftIcon: backArrow,
        rightIcon: isLoading ? undefined : save,
        title: isLoading ? "Сохранение..." : "Редактирование",
      }}
    >
      <EditCollectionContainer
        isLoading={isLoading}
        error={error}
        collection={editableCollection!}
      />
      {modaleMode && (
        <ModalConfirm mode={modaleMode} confirmAction={confirmAction}>
          {modaleText}
        </ModalConfirm>
      )}
    </Layout>
  );
};
