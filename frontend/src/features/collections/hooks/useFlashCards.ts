import { useCallback, useState } from "react";
import {
  useGetCollectionQuery,
  useDeleteCollectionMutation,
} from "@features/collections";
import { useNavigate } from "react-router-dom";
import type { ModalModeType } from "@widgets/modal-confirm";

type Card = {
  word: string;
  translation: string;
};

export const useFlashCards = (collectionId: string) => {
  const { data: collection, isLoading } = useGetCollectionQuery(collectionId);
  const [deleteCollection] = useDeleteCollectionMutation();
  const [unmemTerms, setUnmemTerms] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState(false);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);
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

  const handleClick = useCallback(
    (status: boolean) => {
      if (!collection || !currentCard) return;
      if (!status) {
        setUnmemTerms((card) => [...card, currentCard]);
      }
      if (index >= collection.cards.length - 1) {
        setIsModalOpen(true);
        return;
      }
      setKey((key) => key + 1);
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
    collection,
    isLoading,
    unmemTerms,
    isReversed,
    isMenuOpen,
    isModalOpen,
    key,
    modaleMode,
    progress,
    back,
    options,
    handleClick,
    handleDelete,
    handleSwitchChange,
    closeMenu,
    confirmAction,
  };
};
