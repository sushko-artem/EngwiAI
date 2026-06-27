import { useCallback, useEffect, useMemo, useState } from "react";
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
import type { DragEndEvent } from "@dnd-kit/react";
import type { IGenerationResponse } from "shared/api";
import { isSortable } from "@dnd-kit/react/sortable";
import type { SoundNameType } from "@shared/constants/sounds";

export const useGrammarTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [generateSentences, { data, isLoading, error }] =
    useGenerateSentencesMutation();
  const { play, toggleGroup, isGroupMuted } = useSound();
  const getCachedData = () => {
    const cached = sessionStorage.getItem("grammar_test_cache");
    return cached ? (JSON.parse(cached) as IGenerationResponse) : null;
  };
  const testLength =
    data?.sentences.length ?? getCachedData()?.sentences.length ?? 0;
  const {
    state,
    handleAnswer,
    toggleMenu,
    closeMenu,
    resetTest,
    testInProgress,
  } = useTestReducer(testLength, play);
  const [shuffledWords, setShuffledWords] = useState<
    Array<{ id: string; word: string }>
  >([]);
  const [borderType, setBorderType] = useState<SoundNameType | null>(null);

  useEffect(() => {
    setBorderType(null);
  }, [state.index]);

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
    if (!result) return null;
    return transformDataForTest(result);
  }, [data]);

  useEffect(() => {
    if (processedSentences?.shuffledSentences[state.index]) {
      setShuffledWords([...processedSentences.shuffledSentences[state.index]]);
    }
  }, [state.index, processedSentences]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source;

      if (initialIndex !== index) {
        setShuffledWords((items) => {
          const newItems = [...items];
          const [removed] = newItems.splice(initialIndex, 1);
          newItems.splice(index, 0, removed);
          return newItems;
        });
      }
    }
  }, []);

  const handleUserAnswer = useCallback(() => {
    const userAnswer = shuffledWords.map((item) => item.word).join(" ");
    let borderStyleType: SoundNameType;
    if (processedSentences) {
      borderStyleType = handleAnswer(
        userAnswer || "",
        processedSentences.joinedSentences[state.index],
      );
      setBorderType(borderStyleType);
    }
  }, [handleAnswer, processedSentences, shuffledWords, state.index]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const alertModal = document.querySelector('[data-testId="modal-view"]');
      if (alertModal || state.isMenuOptionsOpen || state.isSummaryModalOpen)
        return;
      if (event.key === "Enter") {
        handleUserAnswer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUserAnswer, state.isMenuOptionsOpen, state.isSummaryModalOpen]);

  return {
    headerProps,
    translation: processedSentences?.translations[state.index],
    shuffledWords,
    isLoading,
    error,
    testLength,
    borderType,
    play,
    toggleGroup,
    isGroupMuted,
    handleUserAnswer,
    closeMenu,
    resetTest,
    handleDragEnd,
    isSummaryOpen: state.isSummaryModalOpen,
    index: state.index,
    rightAnswersCount: state.rightAnswersCounter,
    userMistakes: state.mistakesMadeIn,
    inProgress: state.inProgress,
    isMenuOptionsOpen: state.isMenuOptionsOpen,
  };
};
