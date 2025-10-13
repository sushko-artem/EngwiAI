import { Header } from "@widgets/header";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { useNavigate } from "react-router-dom";
import { ModalConfirm } from "@widgets/modal-confirm";
import {
  EditableCollection,
  type EditableCardType,
} from "@entities/editableCollection";
import { useCollection } from "@features/collections/hooks/useCollection";
import { Loader } from "@shared/ui/loader";
import { createUpdateDto } from "./helpers/createUpdateDto";

interface IEditCollectionProps {
  collectionId: string;
}

export const EditCollection = memo(({ collectionId }: IEditCollectionProps) => {
  const { loading, collection, updateCollection } = useCollection(collectionId);
  const [editedCollection, setEditedCollection] = useState<EditableCardType[]>(
    []
  );
  const [editedCollectionName, setEditedCollectionName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const navigate = useNavigate();
  const deletedCards = useRef<Array<string>>([]);

  useEffect(() => {
    if (collection) {
      setEditedCollection(collection.cards);
      setEditedCollectionName(collection.name);
    }
  }, [collection]);

  const saveCollection = useCallback(async () => {
    if (!collection) return;
    const updatedCards = editedCollection.filter((card) => card.isUpdated);
    const newCards = editedCollection.filter((card) => card.isNew);
    const dto = createUpdateDto(
      collection,
      editedCollectionName,
      updatedCards,
      newCards,
      deletedCards.current
    );
    if (Object.keys(dto).length > 0) {
      const result = await updateCollection(dto);
      if (result.success) navigate("/collections");
    } else {
      navigate("/collections");
    }
  }, [
    editedCollection,
    collection,
    updateCollection,
    editedCollectionName,
    navigate,
  ]);

  const back = useCallback(() => {
    if (!collection) navigate("/collections");
    setModalText("Все несохранённые данные будут утеряны!");
    setModalOpen(true);
  }, [collection, navigate]);

  const handleDelete = useCallback(
    (id: string) => {
      const deletedCard = editedCollection.find((card) => card.id === id);
      if (!deletedCard?.isNew) {
        deletedCards.current.push(id);
      }
    },
    [editedCollection]
  );

  const confirmAction = (value: boolean) => {
    if (value) {
      navigate("/collections");
    } else {
      setModalOpen(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {isModalOpen && (
        <ModalConfirm modalText={modalText} confirmAction={confirmAction} />
      )}
      <Header
        leftIconTitle="вернуться на главную"
        rightIconTitle="сохранить"
        rightIconAction={saveCollection}
        leftIconAction={back}
        leftIcon={backArrow}
        rightIcon={save}
        title="Редактирование"
      />
      {!collection ? (
        <div className="text-3xl font-jost text-fuchsia-800 flex flex-col h-[50vh] justify-center text-center">
          <span>Ошибка!</span> Коллекция не найдена!
        </div>
      ) : (
        <EditableCollection
          onNameChange={setEditedCollectionName}
          onCollectionChange={setEditedCollection}
          onDelete={handleDelete}
          name={editedCollectionName}
          collection={editedCollection}
        />
      )}
    </>
  );
});
