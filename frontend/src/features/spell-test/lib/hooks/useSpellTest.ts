import { useCallback, useEffect, useReducer, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetCardsFromCollectionsMutation } from "@entities/collection/api";
import {
  initialState,
  spellTestReducer,
} from "../reducers/useSpellTestReducer";
import { useNavigationGuard, usePreventReload, useSound } from "@shared/hooks";

export const useSpellTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getCards, { data: collection, isLoading, error }] =
    useGetCardsFromCollectionsMutation();
  const [state, dispatch] = useReducer(spellTestReducer, initialState);
  const { play, toggleGroup, isGroupMuted } = useSound();
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
    getCards({
      collectionIds: location.state.modules,
    });
  }, [navigate, location.state?.modules, getCards]);

  const handleAnswer = useCallback(
    (userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
      if (!collection) return;
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
    [collection],
  );

  const options = useCallback(() => {
    dispatch({ type: "TOGGLE_MENU" });
  }, []);

  const closeMenuOptions = useCallback(() => {
    dispatch({ type: "CLOSE_MENU" });
  }, []);

  const resetTest = useCallback(() => {
    dispatch({ type: "RESET_TEST" });
  }, []);

  return {
    error,
    collection,
    isLoading,
    isSummaryOpen: state.isSummaryModalOpen,
    index: state.index,
    visibleSide: location.state?.visibleSide ?? "word",
    rightAnswersCount: state.rightAnswersCounter,
    userMistakes: state.mistakesMadeIn,
    inProgress: state.inProgress,
    isMenuOptionsOpen: state.isMenuOptionsOpen,
    handleAnswer,
    resetTest,
    options,
    closeMenuOptions,
    play,
    toggleGroup,
    isGroupMuted,
  };
};
