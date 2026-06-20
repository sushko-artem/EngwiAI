import { useGenerateSentencesMutation } from "@features/grammar-test/api/ai-api";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { transformDataForTest } from "../helpers";
import { useNavigationGuard, useSound, useTestReducer } from "@shared/hooks";

export const useGrammarTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [generateSentences, { data, isLoading, error }] =
    useGenerateSentencesMutation();
  const {
    state,
    handleAnswer,
    toggleMenu,
    closeMenu,
    resetTest,
    testInProgress,
  } = useTestReducer();
  const { play, toggleGroup, isGroupMuted } = useSound();

  useEffect(() => {
    if (!location.state?.chosenId) {
      navigate("/grammar-check");
      return;
    }
    const {
      chosenId: id,
      difficulty,
      cardSide,
      numberCount: count,
    } = location.state;

    generateSentences({
      id,
      difficulty,
      cardSide,
      count,
    });
  }, [location.state, navigate, generateSentences]);

  useNavigationGuard({
    shouldBlock: testInProgress,
    confirmMessage:
      "Тест не окончен! Вы действительно хотите покинуть страницу?",
  });

  const processedSentences = useMemo(() => {
    if (!data?.sentences) return null;
    return transformDataForTest(data);
  }, [data]);

  return {
    sentences: processedSentences,
    isLoading,
    error,
    play,
    toggleGroup,
    isGroupMuted,
    handleAnswer,
    toggleMenu,
    closeMenu,
    resetTest,
    isSummaryOpen: state.isSummaryModalOpen,
    index: state.index,
    rightAnswersCount: state.rightAnswersCounter,
    userMistakes: state.mistakesMadeIn,
    inProgress: state.inProgress,
    isMenuOptionsOpen: state.isMenuOptionsOpen,
  };
};
