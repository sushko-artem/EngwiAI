import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetCardsFromCollectionsMutation } from "@entities/collection/api";
import {
  useNavigationGuard,
  usePreventReload,
  useSound,
  useTestReducer,
} from "@shared/hooks";

export const useSpellTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getCards, { data: collection, isLoading, error }] =
    useGetCardsFromCollectionsMutation();
  const {
    state,
    handleAnswer,
    toggleMenu,
    closeMenu,
    resetTest,
    testInProgress,
  } = useTestReducer();
  const { play, toggleGroup, isGroupMuted } = useSound();

  useNavigationGuard({
    shouldBlock: testInProgress,
    confirmMessage:
      "Тест не окончен! Вы действительно хотите покинуть страницу?",
  });

  usePreventReload(testInProgress);

  useEffect(() => {
    if (!location.state?.modules.length) {
      navigate("/spell-check");
      return;
    }
    getCards({
      collectionIds: location.state.modules,
    });
  }, [navigate, location.state?.modules, getCards]);

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
    toggleMenu,
    closeMenu,
    play,
    toggleGroup,
    isGroupMuted,
  };
};
