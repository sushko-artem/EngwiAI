import { useLocation, useNavigate } from "react-router-dom";
import { useGetCardsFromCollectionsMutation } from "@features/collections/api";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { ICard } from "@shared/api";
import { initialState, spellTestReducer } from "./reducers/useSpellTestReducer";
import { useNavigationGuard, usePreventReload } from "@shared/hooks";

export const useSpellTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getCards, { isLoading, error }] = useGetCardsFromCollectionsMutation();
  const [state, dispatch] = useReducer(spellTestReducer, initialState);
  const [collection, setCollection] = useState<ICard[]>([]);
  const index = useRef(state.index);
  index.current = state.index;
  const testInProgress = index.current > 0 && state.inProgress;

  useNavigationGuard({
    shouldBlock: testInProgress,
    confirmMessage:
      "Тест не окончен! Вы действительно хотите покинуть страницу?",
  });

  usePreventReload(testInProgress);

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
    (userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
      dispatch({
        type: "HANDLE_ANSWER",
        payload: {
          collectionLength: collection.length,
          userAnswer,
          correctAnswer,
          isCorrect,
        },
      });
    },
    [collection.length],
  );

  const resetTest = useCallback(() => {
    dispatch({ type: "RESET_TEST" });
  }, []);

  return {
    isSummaryOpen: state.isSummaryModalOpen,
    collection,
    isLoading,
    error,
    getCards,
    index: state.index,
    handleAnswer,
    resetTest,
    visibleSide: location.state.visibleSide,
    rightAnswersCount: state.rightAnswersCounter,
    userMistakes: state.mistakesMadeIn,
  };
};
