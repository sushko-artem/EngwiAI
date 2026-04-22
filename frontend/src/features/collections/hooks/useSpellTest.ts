import { useLocation, useNavigate } from "react-router-dom";
import { useGetCardsFromCollectionsMutation } from "@features/collections/api";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { ICard } from "@shared/api";
import { initialState, spellTestReducer } from "./reducers/useSpellTestReducer";
import { compareUserAnswer } from "../helpers";
import { useNavigationGuard } from "@shared/hooks/useNavigationGuard";

export const useSpellTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getCards, { isLoading, error }] = useGetCardsFromCollectionsMutation();
  const [state, dispatch] = useReducer(spellTestReducer, initialState);
  const [collection, setCollection] = useState<ICard[]>([]);
  const index = useRef(state.index);
  index.current = state.index;
  const testInProgress =
    index.current > 0 &&
    index.current < collection.length &&
    index.current !== collection.length;

  useNavigationGuard({
    shouldBlock: testInProgress,
    confirmMessage: "Покинуть страницу? Данные теста сохранены не будут!",
  });

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

  return {
    collection,
    isLoading,
    error,
    getCards,
    index: state.index,
    handleAnswer,
    visibleSide: location.state.visibleSide,
  };
};
