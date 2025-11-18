import { useCallback, useState } from "react";
import {
  useGetCollectionQuery,
  useDeleteCollectionMutation,
} from "@features/collections";
import { useNavigate } from "react-router-dom";
import type { ModalModeType } from "@widgets/modal-confirm";
import type { ICard } from "@shared/api";

type Card = Omit<ICard, "id">;

export const useFlashCards = (collectionId: string) => {
  const {
    data: collection,
    isLoading,
    error,
  } = useGetCollectionQuery(collectionId);
  const [deleteCollection] = useDeleteCollectionMutation();
  const [unmemTerms, setUnmemTerms] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState(false);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modaleMode, setModaleMode] = useState<ModalModeType>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const progress = collection
    ? ((index + 1) / collection.cards.length) * 100
    : null;
  const currentCard = collection?.cards[index] as Card;

  const back = useCallback(() => {
    navigate("/collections");
  }, [navigate]);

  const options = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleDelete = useCallback(() => {
    setIsMenuOpen(false);
    setModaleMode("confirm");
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleChosenStatus = useCallback(
    (status: boolean) => {
      if (!collection || !currentCard) return;
      if (!status) {
        setUnmemTerms((card) => [...card, currentCard]);
      }
      if (index >= collection.cards.length - 1) {
        setIsModalOpen(true);
        return;
      }
      setIndex((index) => index + 1);
    },
    [collection, currentCard, index]
  );

  const handleSwitchChange = useCallback(() => {
    setIsReversed((state) => !state);
  }, []);

  const confirmAction = useCallback(
    async (value: boolean) => {
      if (value) {
        setModaleMode(null);
        navigate("/collections");
        try {
          await deleteCollection(collectionId).unwrap();
        } catch (error) {
          console.error(error);
        }
      } else {
        setModaleMode(null);
      }
    },
    [collectionId, deleteCollection, navigate]
  );

  return {
    error,
    collection,
    isLoading,
    unmemTerms,
    isReversed,
    isMenuOpen,
    isModalOpen,
    modaleMode,
    progress,
    currentCard,
    index,
    back,
    options,
    handleChosenStatus,
    handleDelete,
    handleSwitchChange,
    closeMenu,
    confirmAction,
  };
};
