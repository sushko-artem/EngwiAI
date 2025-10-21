import { Header } from "@widgets/header";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { useNavigate } from "react-router-dom";
import { ModalConfirm } from "@widgets/modal-confirm";
import { EditableCollection } from "@entities/editableCollection";
import { useCollection } from "@features/collections/hooks/useCollection";
import { Loader } from "@shared/ui/loader";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  clearCollection,
  setExistedCollection,
} from "@features/collections/model/collections.slice";
import { createUpdateDto } from "./helpers/createUpdateDto";

interface IEditCollectionProps {
  collectionId: string;
}

export const EditCollection = memo(({ collectionId }: IEditCollectionProps) => {
  const { collection, error, update, updateCollection } =
    useCollection(collectionId);
  const editableCollection = useAppSelector(
    (state) => state.collections.editableCollection
  );
  const deletedCards = useAppSelector(
    (state) => state.collections.deletedCards
  );
  const dispatch = useAppDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const navigate = useNavigate();
  const originalCollectionRef = useRef(collection);
  const editableCollectionRef = useRef(editableCollection);
  const deletedCardsRef = useRef(deletedCards);

  useEffect(() => {
    editableCollectionRef.current = editableCollection;
    deletedCardsRef.current = deletedCards;
  }, [editableCollection, deletedCards]);

  useEffect(() => {
    if (collection) {
      originalCollectionRef.current = collection;
      dispatch(setExistedCollection(collection));
    }
    return () => {
      dispatch(clearCollection());
    };
  }, [dispatch, collection]);

  const saveCollection = useCallback(async () => {
    if (!originalCollectionRef.current || !editableCollectionRef.current)
      return;
    const dto = createUpdateDto(
      originalCollectionRef.current,
      editableCollectionRef.current,
      deletedCardsRef.current
    );
    if (Object.keys(dto).length > 0) {
      const res = await updateCollection(dto);
      if (res.success) {
        navigate("/collections");
      } else {
        setModalText(`${res.error}`);
        setModalOpen(true);
      }
    }
  }, [updateCollection, navigate]);

  const back = useCallback(() => {
    const isNameUpdated =
      editableCollectionRef.current?.name !==
      originalCollectionRef.current?.name;
    const isCardsUpdated =
      editableCollectionRef.current?.cards.some(
        (card) => card.isUpdated || card.isNew
      ) ||
      editableCollectionRef.current?.cards.length !==
        originalCollectionRef.current?.cards.length;
    const isUpdated = isNameUpdated || isCardsUpdated;
    if (isUpdated) {
      setModalText(
        "Вы действительно хотите покинуть страницу? Внесенные изменения сохранены не будут!"
      );
      setModalOpen(true);
    } else {
      navigate("/collections");
    }
  }, [navigate]);

  const confirmAction = (value: boolean) => {
    if (value) {
      navigate("/collections");
    } else {
      setModalOpen(false);
    }
  };

  return (
    <>
      {update && <Loader />}
      {isModalOpen && (
        <ModalConfirm modalText={modalText} confirmAction={confirmAction} />
      )}
      <Header
        leftIconTitle="вернуться на главную"
        rightIconTitle="сохранить"
        rightIconAction={saveCollection}
        leftIconAction={back}
        leftIcon={backArrow}
        rightIcon={update ? undefined : save}
        title={update ? "Сохранение..." : "Редактирование"}
      />
      {!editableCollection ? (
        error ? (
          <div className="text-3xl font-jost text-fuchsia-800 flex flex-col h-[50vh] justify-center text-center">
            <span>Ошибка!</span> Коллекция не найдена!
            <span className="text-red-500 text-lg">{error.message}</span>
          </div>
        ) : (
          <Loader />
        )
      ) : (
        <EditableCollection
          name={editableCollection.name}
          collection={editableCollection.cards}
        />
      )}
    </>
  );
});
