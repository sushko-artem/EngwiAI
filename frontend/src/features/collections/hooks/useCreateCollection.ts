import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  clearCollection,
  selectEditableCollection,
  initDefaultCollection,
  useCreateCollectionMutation,
} from "@features/collections";
import type { ModalModeType } from "@widgets/modal-confirm";

export const useCreateCollection = () => {
  const collection = useAppSelector(selectEditableCollection);
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const [modaleMode, setModaleMode] = useState<ModalModeType>(null);
  const [modaleText, setModaleText] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const collectionRef = useRef(collection);

  useEffect(() => {
    collectionRef.current = collection;
  }, [collection]);

  useEffect(() => {
    dispatch(initDefaultCollection());
    return () => {
      dispatch(clearCollection());
    };
  }, [dispatch]);

  const saveCollection = useCallback(async () => {
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
        console.error("Collection create error:", error);
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
