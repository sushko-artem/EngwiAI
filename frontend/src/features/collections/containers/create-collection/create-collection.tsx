import { memo, useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { ModalConfirm } from "@shared/ui/modal-confirm";
import { Header } from "@shared/ui/header";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { useCollections } from "@features/collections/hooks/useCollections";
import {
  EditableCollection,
  type CollectionStateType,
} from "@entities/editableCollection";

export const CreateCollection = memo(() => {
  const [collection, setCollection] = useState<CollectionStateType[]>([
    { id: nanoid(), word: "", translation: "" },
    { id: nanoid(), word: "", translation: "" },
  ]);
  const [collectionName, setCollectionName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isWarning, setIsWarning] = useState(false);
  const { createCollection } = useCollections();
  const navigate = useNavigate();

  const saveCollection = useCallback(async () => {
    if (collection.length < 1) return;
    if (!collectionName.trim()) {
      setModalText("Придумайте название коллекции!");
      setIsWarning(true);
      setModalOpen(true);
      return;
    }

    const hasEmptyFields = collection.some(
      (item) => !item.word.trim() || !item.translation.trim()
    );

    if (hasEmptyFields) {
      setModalText("Все поля карточек должны быть заполнены!");
      setIsWarning(true);
      setModalOpen(true);
      return;
    }

    try {
      const cards = collection.map((card) => ({
        word: card.word.trim(),
        translation: card.translation.trim(),
      }));

      const res = await createCollection({
        name: collectionName.trim(),
        cards,
      });

      if (res.success) {
        navigate("/dashboard");
      } else {
        console.error("Ошибка:", res.error);
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
    }
  }, [collection, collectionName, createCollection, navigate]);

  const back = useCallback(() => {
    if (
      collection.length &&
      collection.some((item) => item.word || item.translation)
    ) {
      setModalText("Все несохранённые данные будут утеряны!");
      setIsWarning(false);
      setModalOpen(true);
    } else navigate("/dashboard");
  }, [navigate, collection]);

  const confirmAction = (value: boolean) => {
    if (value) {
      navigate("/dashboard");
    } else {
      setModalOpen(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <ModalConfirm
          modalText={modalText}
          confirmAction={confirmAction}
          isWarning={isWarning}
        />
      )}
      <Header
        leftIconTitle="вернуться на главную"
        rightIconTitle="сохранить"
        rightIconAction={saveCollection}
        leftIconAction={back}
        leftIcon={backArrow}
        rightIcon={save}
        title="Новая коллекция"
      />
      <EditableCollection
        collection={collection}
        name={collectionName}
        onNameChange={setCollectionName}
        onCollectionChange={setCollection}
      />
    </>
  );
});
