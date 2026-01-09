import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@redux/hooks";
import {
  clearCollection,
  initDefaultCollection,
  type EditableCollectionType,
} from "@features/collections/model";
import {
  useCreateCollectionMutation,
  useGetCollectionsQuery,
} from "@features/collections/api";
import { getErrorMessage } from "@shared/api";
import { useModal } from "@widgets/modal";
import { validateCollection } from "../helpers";

export const useCreateCollection = (
  collection: EditableCollectionType | null
) => {
  const { data: collections } = useGetCollectionsQuery();
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const { warning, confirm } = useModal();
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
    const validate = validateCollection(
      collectionRef.current,
      existedNamesRef.current
    );
    if (!validate.isValid) {
      if (validate.errorMessage) {
        warning(validate.errorMessage);
      }
      return;
    }

    try {
      const cards = collectionRef.current!.cards.map((card) => ({
        id: card.id,
        word: card.word.trim(),
        translation: card.translation.trim(),
      }));
      const name = collectionRef.current!.name.trim();
      await createCollection({ name, cards }).unwrap();
      navigate("/collections", { replace: true, state: { refetch: true } });
    } catch (error) {
      warning(getErrorMessage(error));
    }
  }, [navigate, createCollection, warning]);

  const back = useCallback(async () => {
    if (
      collectionRef.current?.name.trim() ||
      collectionRef.current?.cards.find(
        (card) => card.word.trim() || card.translation.trim()
      )
    ) {
      const shouldLeaveThePage = await confirm(
        "Все несохраненные данные будут потеряны!"
      );
      if (shouldLeaveThePage) navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  }, [navigate, confirm]);

  return {
    isLoading,
    saveCollection,
    back,
  };
};
