import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { useGetCardsFromCollectionsMutation } from "@entities/collection/api";
import {
  useNavigationGuard,
  usePreventReload,
  useSound,
  useTestReducer,
} from "@shared/hooks";
import type { SoundNameType } from "@shared/constants/sounds";
import type { SideValueType } from "@widgets/choose-collection";

export const useSpellTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getCards, { data: collection, isLoading, error }] =
    useGetCardsFromCollectionsMutation();
  const { toggleGroup, isGroupMuted, play } = useSound();
  const {
    state,
    toggleMenu,
    closeMenu,
    resetTest,
    testInProgress,
    handleAnswer,
  } = useTestReducer(collection?.length, play);
  const [borderType, setBorderType] = useState<SoundNameType | null>(null);

  useEffect(() => {
    setBorderType(null);
  }, [state.index]);

  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться к выбору модулей",
      rightIconTitle: "настройки",
      rightIconAction: toggleMenu,
      leftIconAction: () => navigate("/spell-check"),
      leftIcon: backArrow,
      rightIcon: option,
      title: "Тест орфографии",
    }),
    [navigate, toggleMenu],
  );

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
  }, [navigate, location.state.modules, getCards]);

  const handleUserAnswer = useCallback(
    (userAnswer: string, correctAnswer: string) => {
      const borderStyleType = handleAnswer(userAnswer, correctAnswer);
      setBorderType(borderStyleType);
    },
    [handleAnswer],
  );

  return {
    headerProps,
    error,
    collection,
    isLoading,
    borderType,
    isSummaryOpen: state.isSummaryModalOpen,
    index: state.index,
    visibleSide: location.state.visibleSide as SideValueType,
    rightAnswersCount: state.rightAnswersCounter,
    userMistakes: state.mistakesMadeIn,
    inProgress: state.inProgress,
    isMenuOptionsOpen: state.isMenuOptionsOpen,
    handleUserAnswer,
    resetTest,
    toggleMenu,
    closeMenu,
    toggleGroup,
    isGroupMuted,
  };
};
