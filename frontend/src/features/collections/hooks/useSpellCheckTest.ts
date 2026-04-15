import { useLocation, useNavigate } from "react-router-dom";
import { useGetCardsFromCollectionsMutation } from "../api/collections-api";
import { useCallback, useEffect, useState } from "react";
import type { ICard } from "@shared/api";

export const useSpellCheckTest = () => {
  const [getCards, { isLoading, error }] = useGetCardsFromCollectionsMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collection, setCollection] = useState<ICard[]>([]);

  useEffect(() => {
    if (!location.state?.modules) {
      navigate("/spell-check");
      return;
    }
    async function getCardsFromCollections() {
      try {
        const result = await getCards({
          collectionIds: location.state.modules,
        }).unwrap();
        setCollection(result);
      } catch (err) {
        console.error("Failed to load cards:", err);
        navigate("/spell-check");
      }
    }
    getCardsFromCollections();
  }, [navigate, location.state?.modules, getCards]);

  const back = useCallback(() => {
    navigate("/spell-check");
  }, [navigate]);

  return {
    collection,
    back,
    isLoading,
    error,
    getCards,
  };
};
