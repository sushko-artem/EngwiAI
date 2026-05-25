import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@redux/hooks";
import {
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
import { useNavigationGuard } from "@shared/hooks";

export const useCreateCollection = (
  collection: EditableCollectionType | null,
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { data: collections } = useGetCollectionsQuery();
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const { warning } = useModal();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const collectionRef = useRef(collection);
  const existedNamesRef = useRef<string[]>([]);

  useEffect(() => {
    collectionRef.current = collection;
  }, [collection]);

  useEffect(() => {
    dispatch(initDefaultCollection());
  }, [dispatch]);

  useEffect(() => {
    if (collections) {
      existedNamesRef.current = collections.map(
        (collection) => collection.name,
      );
    }
  }, [collections]);

  const hasAnyChanges = useMemo(() => {
    if (!collection) return false;

    const hasName = !!collection.name.trim();
    const hasCard = !!collection.cards.find(
      (card) => card.word?.trim() || card.translation?.trim(),
    );

    return hasName || hasCard;
  }, [collection]);

  useNavigationGuard({
    shouldBlock: hasAnyChanges,
    skipGuard: isSaving,
    confirmMessage: "Все несохраненные данные будут потеряны!",
  });

  const saveCollection = useCallback(async () => {
    const validate = validateCollection(
      collectionRef.current,
      existedNamesRef.current,
    );
    if (!validate.isValid) {
      if (validate.errorMessage) {
        warning(validate.errorMessage);
      }
      return;
    }
    setIsSaving(true);
    try {
      const cards = collectionRef.current!.cards.map((card) => ({
        id: card.id,
        word: card.word?.trim(),
        translation: card.translation?.trim(),
      }));
      const name = collectionRef.current!.name.trim();
      await createCollection({ name, cards }).unwrap();
      navigate("/collections", { replace: true, state: { refetch: true } });
    } catch (error) {
      warning(getErrorMessage(error));
      setIsSaving(false);
    }
  }, [navigate, createCollection, warning]);

  return {
    isSaving: isSaving || isLoading,
    saveCollection,
  };
};
