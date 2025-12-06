import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@redux/hooks";
import {
  clearCollection,
  initDefaultCollection,
  useCreateCollectionMutation,
  useGetCollectionsQuery,
  type EditableCollectionType,
} from "@features/collections";
import type { ModalModeType } from "@widgets/modal-confirm";
import { getErrorMessage } from "@shared/api";

export const useCreateCollection = (
  collection: EditableCollectionType | null
) => {
  const { data: collections } = useGetCollectionsQuery();
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const [modaleMode, setModaleMode] = useState<ModalModeType>(null);
  const [modaleText, setModaleText] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const collectionRef = useRef(collection);
  const existedNamesRef = useRef<string[]>([]);

  useEffect(() => {
    collectionRef.current = collection;
  }, [collection]);

  useEffect(() => {
    dispatch(initDefaultCollection());
    return () => {
      dispatch(clearCollection());
    };
  }, [dispatch]);

  useEffect(() => {
    if (collections) {
      existedNamesRef.current = collections.map(
        (collection) => collection.name
      );
    }
  }, [collections]);

  const saveCollection = useCallback(async () => {
    console.log(collectionRef.current);
    if (
      collectionRef.current?.name &&
      existedNamesRef.current.includes(collectionRef.current.name.trim())
    ) {
      setModaleText("Коллекция с таким именем уже существует");
      setModaleMode("warn");
      return;
    }
    if (
      !collectionRef.current?.name.trim() ||
      collectionRef.current?.cards.some(
        (card) => !card.word.trim() || !card.translation.trim()
      )
    ) {
      setModaleText("Все поля должны быть заполнены!");
      setModaleMode("warn");
    } else {
      try {
        const cards = collectionRef.current.cards.map((card) => ({
          id: card.id,
          word: card.word.trim(),
          translation: card.translation.trim(),
        }));
        await createCollection({
          name: collectionRef.current.name.trim(),
          cards,
        }).unwrap();
        navigate("/collections");
      } catch (error) {
        setModaleText(getErrorMessage(error));
        setModaleMode("warn");
      }
    }
  }, [navigate, createCollection]);

  const back = useCallback(() => {
    if (
      collectionRef.current?.name.trim() ||
      collectionRef.current?.cards.find(
        (card) => card.word.trim() || card.translation.trim()
      )
    ) {
      setModaleText("Все несохраненные данные будут потеряны!");
      setModaleMode("confirm");
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  const confirmAction = useCallback(
    (value: boolean) => {
      if (value) {
        navigate("/dashboard");
      } else {
        setModaleMode(null);
        setModaleText("");
      }
    },
    [navigate]
  );

  return {
    isLoading,
    modaleMode,
    modaleText,
    collection,
    saveCollection,
    back,
    confirmAction,
  };
};
