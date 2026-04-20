import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  setExistedCollection,
  selectEditCollectionState,
} from "@features/collections/model";
import {
  useGetCollectionQuery,
  useUpdateCollectionMutation,
  useGetCollectionsQuery,
} from "@features/collections/api";
import { getErrorMessage } from "@shared/api";
import {
  createUpdateDto,
  validateCollection,
} from "@features/collections/helpers";
import { useModal } from "@widgets/modal";
import { useNavigationGuard } from "./useNavigationGuard";

export const useEditCollection = (collectionId: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { warning } = useModal();
  const { editableCollection, deletedCards } = useAppSelector(
    selectEditCollectionState,
  );
  const { data: collections } = useGetCollectionsQuery();
  const { data: collection, error } = useGetCollectionQuery(collectionId);
  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();
  const [isSaving, setIsSaving] = useState(false);
  const originalCollectionNameRef = useRef(collection?.name);
  const editableCollectionRef = useRef(editableCollection);
  const deletedCardsRef = useRef(deletedCards);
  const existedNamesRef = useRef<string[]>([]);
  editableCollectionRef.current = editableCollection;
  deletedCardsRef.current = deletedCards;

  useEffect(() => {
    if (collection) {
      originalCollectionNameRef.current = collection.name;
      dispatch(setExistedCollection(collection));
    }
  }, [dispatch, collection]);

  useEffect(() => {
    if (collections) {
      existedNamesRef.current = collections
        .map((collection) => collection.name)
        .filter((name) => name !== originalCollectionNameRef.current);
    }
  }, [collections]);

  const hasChanges = useMemo(() => {
    const isNameUpdated =
      editableCollection?.name.trim() !==
      originalCollectionNameRef.current?.trim();
    const isCardsUpdated =
      editableCollection?.cards.some((card) => card.isUpdated || card.isNew) ||
      deletedCards.length > 0;
    return isNameUpdated || isCardsUpdated;
  }, [editableCollection, deletedCards]);

  useNavigationGuard({
    shouldBlock: hasChanges,
    skipGuard: isSaving,
    confirmMessage:
      "Вы действительно хотите покинуть страницу? Внесенные изменения сохранены не будут!",
  });

  const saveCollection = useCallback(async () => {
    if (!hasChanges) {
      navigate("/collections");
      return;
    }
    const validate = validateCollection(
      editableCollectionRef.current,
      existedNamesRef.current,
    );
    if (!validate.isValid) {
      if (validate.errorMessage) {
        warning(validate.errorMessage);
      }
      return;
    }
    const dto = createUpdateDto(
      originalCollectionNameRef.current!,
      editableCollectionRef.current!,
      deletedCardsRef.current,
    );
    if (Object.keys(dto).length > 0) {
      setIsSaving(true);
      try {
        await updateCollection({ id: collectionId, dto }).unwrap();
        navigate("/collections", { replace: true, state: { refetch: true } });
      } catch (error) {
        warning(getErrorMessage(error));
      }
    }
  }, [navigate, updateCollection, collectionId, warning, hasChanges]);

  return {
    error,
    isLoading,
    editableCollection,
    saveCollection,
  };
};
