import { Loader } from "@shared/ui/loader";
import {
  EditableCollection,
  type EditableCardType,
} from "@widgets/editableCollection";
import { ModalConfirm, type ModalModeType } from "@widgets/modal-confirm";
import { memo } from "react";

type CreateCollectionPropType = {
  isLoading: boolean;
  modaleMode: ModalModeType;
  modaleText: string;
  collection: { name: string; cards: EditableCardType[] };
  confirmAction(value: boolean): void;
};

export const CreateCollectionContainer = memo(
  ({
    isLoading,
    modaleMode,
    modaleText,
    collection,
    confirmAction,
  }: CreateCollectionPropType) => {
    if (!collection) {
      return <Loader />;
    }
    const { name, cards } = collection;
    return (
      <>
        {isLoading && <Loader />}
        {modaleMode && (
          <ModalConfirm confirmAction={confirmAction} mode={modaleMode}>
            {modaleText}
          </ModalConfirm>
        )}
        <EditableCollection collection={cards} name={name} />
      </>
    );
  }
);
