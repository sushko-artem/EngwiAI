import { memo } from "react";
import { ModalConfirm } from "@widgets/index";
import {
  EditableCollection,
  type EditableCardType,
} from "@widgets/editableCollection";
import { Loader } from "@shared/ui/loader";
import { NotFoundCollection } from "@features/collections";

interface IEditCollectionContainerProps {
  isLoading: boolean;
  modaleMode: "warn" | "confirm" | null;
  modaleText: string;
  confirmAction(value: boolean): void;
  collection: { name: string; cards: EditableCardType[] };
  error: unknown;
}

export const EditCollectionContainer = memo(
  ({
    isLoading,
    modaleMode,
    modaleText,
    confirmAction,
    collection,
    error,
  }: IEditCollectionContainerProps) => {
    if (!collection) {
      return <Loader />;
    }
    const { name, cards } = collection;
    return (
      <>
        {isLoading && <Loader />}
        {modaleMode && (
          <ModalConfirm mode={modaleMode} confirmAction={confirmAction}>
            {modaleText}
          </ModalConfirm>
        )}
        {error ? (
          <NotFoundCollection error={error} />
        ) : (
          <EditableCollection name={name} collection={cards} />
        )}
      </>
    );
  }
);
