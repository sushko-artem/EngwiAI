import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  clearCollection,
  setExistedCollection,
  createUpdateDto,
  selectDeletedCards,
  selectEditableCollection,
  useGetCollectionQuery,
  useUpdateCollectionMutation,
  useGetCollectionsQuery,
} from "@features/collections";
import { getErrorMessage } from "@shared/api";
import type { ModalModeType } from "@widgets/modal-confirm";

export const useEditCollection = (collectionId: string) => {
  const { data: collections } = useGetCollectionsQuery();
  const { data: collection, error } = useGetCollectionQuery(collectionId);
  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();
  const editableCollection = useAppSelector(selectEditableCollection);
  const deletedCards = useAppSelector(selectDeletedCards);
  const dispatch = useAppDispatch();
  const [modaleMode, setModaleMode] = useState<ModalModeType>(null);
  const [modaleText, setModaleText] = useState("");
  const navigate = useNavigate();
  const originalCollectionRef = useRef(collection);
  const editableCollectionRef = useRef(editableCollection);
  const deletedCardsRef = useRef(deletedCards);
  const existedNamesRef = useRef<string[]>([]);

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

  useEffect(() => {
    if (collections) {
      existedNamesRef.current = collections
        .map((collection) => collection.name)
        .filter((name) => name !== originalCollectionRef.current?.name);
    }
  }, [collections]);

  const saveCollection = useCallback(async () => {
    if (!originalCollectionRef.current || !editableCollectionRef.current) {
      return;
    }
    if (
      !editableCollectionRef.current.name.trim() ||
      editableCollectionRef.current.cards.some(
        (card) => !card.word.trim() || !card.translation.trim()
      )
    ) {
      setModaleText("Все поля должны быть заполнены!");
      setModaleMode("warn");
      return;
    }
    if (
      existedNamesRef.current.includes(
        editableCollectionRef.current.name.trim()
      )
    ) {
      setModaleText("Коллекция с таким именем уже существует");
      setModaleMode("warn");
      return;
    }
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
        setModaleText(getErrorMessage(error));
        setModaleMode("warn");
      }
    }
  }, [navigate, updateCollection, collectionId]);

  const back = useCallback(() => {
    const isNameUpdated =
      editableCollectionRef.current?.name.trim() !==
      originalCollectionRef.current?.name.trim();
    const isCardsUpdated =
      editableCollectionRef.current?.cards.some(
        (card) => card.isUpdated || card.isNew
      ) ||
      editableCollectionRef.current?.cards.length !==
        originalCollectionRef.current?.cards.length;
    const isUpdated = isNameUpdated || isCardsUpdated;
    if (isUpdated) {
      setModaleText(
        "Вы действительно хотите покинуть страницу? Внесенные изменения сохранены не будут!"
      );
      setModaleMode("confirm");
    } else {
      navigate("/collections");
    }
  }, [navigate]);

  const confirmAction = useCallback(
    (value: boolean) => {
      if (value) {
        navigate("/collections");
      } else {
        setModaleMode(null);
        setModaleText("");
      }
    },
    [navigate]
  );

  return {
    error,
    isLoading,
    modaleText,
    modaleMode,
    editableCollection,
    saveCollection,
    back,
    confirmAction,
  };
};
