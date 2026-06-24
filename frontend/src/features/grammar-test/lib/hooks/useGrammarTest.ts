import { useEffect, useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { useGenerateSentencesMutation } from "@features/grammar-test/api/ai-api";
import { useLocation, useNavigate } from "react-router-dom";
import { transformDataForTest } from "../helpers";
import {
  useNavigationGuard,
  usePreventReload,
  useSound,
  useTestReducer,
} from "@shared/hooks";

export const useGrammarTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [generateSentences, { data, isLoading, error }] =
    useGenerateSentencesMutation();
  const { play, toggleGroup, isGroupMuted } = useSound();
  const getCachedData = () => {
    const cached = sessionStorage.getItem("grammar_test_cache");
    return cached ? JSON.parse(cached) : null;
  };
  const testLength =
    data?.sentences.length || getCachedData()?.sentences.length;
  const {
    state,
    handleAnswer,
    toggleMenu,
    closeMenu,
    resetTest,
    testInProgress,
  } = useTestReducer(testLength, play);

  useEffect(() => {
    if (!location.state) {
      navigate("/grammar-check");
      return;
    }
    if (getCachedData()) return;

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
    })
      .unwrap()
      .then((res) => {
        sessionStorage.setItem("grammar_test_cache", JSON.stringify(res));
      });
  }, [location.state, navigate, generateSentences]);

  const headerProps = useMemo(
    () => ({
      title: "Грамматический тест",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      rightIcon: option,
      leftIconAction: () => navigate("/grammar-check"),
      rightIconAction: toggleMenu,
    }),
    [navigate, toggleMenu],
  );

  useNavigationGuard({
    shouldBlock: testInProgress,
    confirmMessage:
      "Тест не окончен! Вы действительно хотите покинуть страницу?",
  });

  usePreventReload(testInProgress);

  const processedSentences = useMemo(() => {
    const result = getCachedData() || data;
    if (!result?.sentences) return null;
    return transformDataForTest(result);
  }, [data]);

  return {
    headerProps,
    sentences: processedSentences,
    isLoading,
    error,
    play,
    toggleGroup,
    isGroupMuted,
    handleAnswer,
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
