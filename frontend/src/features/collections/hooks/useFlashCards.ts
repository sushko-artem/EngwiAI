import { useCallback, useRef, useState } from "react";
import {
  useGetCollectionQuery,
  useDeleteCollectionMutation,
} from "@features/collections/api";
import { useNavigate } from "react-router-dom";
import type { ICard } from "@shared/api";
import { useModal } from "@widgets/modal";

type Card = Omit<ICard, "id">;

export const useFlashCards = (collectionId: string) => {
  const {
    data: collection,
    isLoading,
    error,
  } = useGetCollectionQuery(collectionId);
  const { confirm } = useModal();
  const navigate = useNavigate();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [unmemTerms, setUnmemTerms] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState(false);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const collectionRef = useRef(collection);
  const indexRef = useRef(index);
  collectionRef.current = collection;
  indexRef.current = index;

  const back = useCallback(() => {
    navigate("/collections");
  }, [navigate]);

  const options = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleDelete = useCallback(async () => {
    setIsMenuOpen(false);
    const isDelete = await confirm(
      `Удалить коллекцию "${collectionRef.current?.name}"?`
    );
    if (isDelete) {
      try {
        navigate("/collections");
        await deleteCollection(collectionId).unwrap();
      } catch (error) {
        console.error(error);
      }
    }
  }, [confirm, navigate, deleteCollection, collectionId]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleChosenStatus = useCallback((status: boolean) => {
    const currentCollection = collectionRef.current;
    const currentIndex = indexRef.current;
    if (!currentCollection) return;
    if (!status) {
      setUnmemTerms((card) => [...card, currentCollection.cards[currentIndex]]);
    }
    if (currentIndex >= currentCollection.cards.length - 1) {
      setIsModalOpen(true);
      return;
    }
    setIndex((index) => index + 1);
  }, []);

  const handleSwitchChange = useCallback(() => {
    setIsReversed((state) => !state);
  }, []);

  return {
    error,
    collection,
    isLoading,
    unmemTerms,
    isReversed,
    isMenuOpen,
    isModalOpen,
    index,
    back,
    options,
    handleChosenStatus,
    handleDelete,
    handleSwitchChange,
    closeMenu,
  };
};
