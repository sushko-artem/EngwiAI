import { useCallback, useMemo, useReducer } from "react";
import {
  useGetCollectionQuery,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation,
} from "@features/collections/api";
import { useNavigate } from "react-router-dom";
import { useModal } from "@widgets/modal";
import { flashCardsReducer, initialState } from "./useFlashCardsReducer";
import { isVirtualCollection } from "../helpers";

export const useFlashCards = (collectionId: string) => {
  const {
    data: collection,
    isLoading,
    error,
  } = useGetCollectionQuery(collectionId);
  const [state, dispatch] = useReducer(flashCardsReducer, initialState);
  const { confirm } = useModal();
  const navigate = useNavigate();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();

  const isVirtual = useMemo(
    () => isVirtualCollection(collectionId),
    [collectionId],
  );

  const options = useCallback(() => {
    dispatch({ type: "TOGGLE_MENU" });
  }, []);

  const handleDelete = useCallback(async () => {
    dispatch({ type: "CLOSE_MENU" });
    const isDelete = await confirm(`Удалить коллекцию "${collection?.name}"?`);
    if (isDelete) {
      try {
        navigate("/collections");
        await deleteCollection(collectionId).unwrap();
      } catch (error) {
        console.error(error);
      }
    }
  }, [confirm, navigate, deleteCollection, collection, collectionId]);

  const closeMenu = useCallback(() => {
    dispatch({ type: "CLOSE_MENU" });
  }, []);

  const handleChosenStatus = useCallback(
    (status: boolean) => {
      if (!collection) return;
      const flashCollection = collection.cards;
      dispatch({
        type: "HANDLE_CHOSEN_STATUS",
        payload: {
          collection: flashCollection,
          status,
        },
      });
    },
    [collection],
  );

  const handleSwitchChange = useCallback(() => {
    dispatch({ type: "TOGGLE_REVERSED" });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_FOR_RETRY" });
  }, []);

  const back = useCallback(() => {
    navigate("/collections");
  }, [navigate]);

  const updateStatus = useCallback(() => {
    const updatedCards = state.actualStatus;
    updateCollection({
      id: collectionId,
      dto: { updatedCards },
    });
  }, [updateCollection, collectionId, state.actualStatus]);

  return {
    error,
    collection,
    isLoading,
    unmemTerms: state.unmemTerms,
    isReversed: state.isReversed,
    isMenuOpen: state.isMenuOpen,
    isModalOpen: state.isModalOpen,
    isVirtual,
    index: state.index,
    back,
    options,
    handleChosenStatus,
    handleDelete,
    handleSwitchChange,
    closeMenu,
    handleReset,
    updateStatus,
  };
};
