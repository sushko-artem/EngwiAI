import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  clearCollection,
  setExistedCollection,
  selectDeletedCards,
  selectEditableCollection,
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

export const useEditCollection = (collectionId: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { warning, confirm } = useModal();
  const editableCollection = useAppSelector(selectEditableCollection);
  const deletedCards = useAppSelector(selectDeletedCards);
  const { data: collections } = useGetCollectionsQuery();
  const { data: collection, error } = useGetCollectionQuery(collectionId);
  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();
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
    return () => {
      dispatch(clearCollection());
    };
  }, [dispatch, collection]);

  useEffect(() => {
    if (collections) {
      existedNamesRef.current = collections
        .map((collection) => collection.name)
        .filter((name) => name !== originalCollectionNameRef.current);
    }
  }, [collections]);

  const hasAnyChanges = useCallback(() => {
    const isNameUpdated =
      editableCollectionRef.current?.name.trim() !==
      originalCollectionNameRef.current?.trim();
    const isCardsUpdated =
      editableCollectionRef.current?.cards.some(
        (card) => card.isUpdated || card.isNew
      ) || !!deletedCardsRef.current.length;
    return isNameUpdated || isCardsUpdated;
  }, []);

  const saveCollection = useCallback(async () => {
    if (!hasAnyChanges()) {
      navigate("/collections");
      return;
    }
    const validate = validateCollection(
      editableCollectionRef.current,
      existedNamesRef.current
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
      deletedCardsRef.current
    );
    if (Object.keys(dto).length > 0) {
      try {
        await updateCollection({ id: collectionId, dto }).unwrap();
        navigate("/collections", { replace: true, state: { refetch: true } });
      } catch (error) {
        warning(getErrorMessage(error));
      }
    }
  }, [navigate, updateCollection, collectionId, warning, hasAnyChanges]);

  const back = useCallback(async () => {
    if (hasAnyChanges()) {
      const shouldLeaveThePage = await confirm(
        "Вы действительно хотите покинуть страницу? Внесенные изменения сохранены не будут!"
      );
      if (shouldLeaveThePage) navigate("/collections");
    } else {
      navigate("/collections");
    }
  }, [navigate, confirm, hasAnyChanges]);

  return {
    error,
    isLoading,
    editableCollection,
    saveCollection,
    back,
  };
};
