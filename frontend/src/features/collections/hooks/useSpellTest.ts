import { useLocation, useNavigate } from "react-router-dom";
import { useGetCardsFromCollectionsMutation } from "../api/collections-api";
import { useCallback, useEffect, useReducer, useState } from "react";
import type { ICard } from "@shared/api";
import { initialState, spellTestReducer } from "./reducers/useSpellTestReducer";
import { compareUserAnswer } from "../helpers";

export const useSpellTest = () => {
  const [getCards, { isLoading, error }] = useGetCardsFromCollectionsMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(spellTestReducer, initialState);
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

  const handleAnswer = useCallback(
    (userAnswer: string, originalValue: string) => {
      const isRight = compareUserAnswer(userAnswer, originalValue);
      console.log(isRight);
      if (state.index + 1 === collection.length) return;
      dispatch({ type: "INCREMENT_INDEX" });
    },
    [state.index, collection.length],
  );

  const back = useCallback(() => {
    navigate("/spell-check");
  }, [navigate]);

  return {
    collection,
    back,
    isLoading,
    error,
    getCards,
    index: state.index,
    handleAnswer,
    visibleSide: location.state.visibleSide,
  };
};
