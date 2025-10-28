import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, ModalConfirm } from "@widgets/index";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { EditableCollection } from "@entities/editableCollection";
import { Loader } from "@shared/ui/loader";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  clearCollection,
  setExistedCollection,
  createUpdateDto,
  selectDeletedCards,
  selectEditableCollection,
  useGetCollectionQuery,
  useUpdateCollectionMutation,
} from "@features/collections";
import { getErrorMessage } from "@shared/api";

interface IEditCollectionProps {
  collectionId: string;
}

export const EditCollection = memo(({ collectionId }: IEditCollectionProps) => {
  const {
    data: collection,
    error,
    isLoading,
  } = useGetCollectionQuery(collectionId);
  const [updateCollection] = useUpdateCollectionMutation();
  const editableCollection = useAppSelector(selectEditableCollection);
  const deletedCards = useAppSelector(selectDeletedCards);
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
      try {
        await updateCollection({ id: collectionId, dto }).unwrap();
        navigate("/collections");
      } catch (error) {
        setModalText(getErrorMessage(error));
        setModalOpen(true);
      }
    }
  }, [navigate, updateCollection, collectionId]);

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
      {isLoading && <Loader />}
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
        title={"Редактирование"}
      />
      {!editableCollection ? (
        error ? (
          <div className="text-3xl font-jost text-fuchsia-800 flex flex-col h-[50vh] justify-center text-center">
            <span>Ошибка!</span> Коллекция не найдена!
            <span className="text-red-500 text-lg">
              Error: {getErrorMessage(error)}
            </span>
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
