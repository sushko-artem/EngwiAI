import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { useGetCardsFromCollectionsMutation } from "@entities/collection/api";
import {
  useNavigationGuard,
  usePreventReload,
  useTestReducer,
} from "@shared/hooks";
import type { SpellTestNavigationState } from "@shared/types";

export const useSpellTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as SpellTestNavigationState | null;
  const [getCards, { data: collection, isLoading, error }] =
    useGetCardsFromCollectionsMutation();
  const {
    state,
    borderType,
    toggleMenu,
    toggleGroup,
    isGroupMuted,
    closeMenu,
    resetTest,
    testInProgress,
    handleAnswer,
  } = useTestReducer(collection?.length);

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
    if (!locationState?.modules || !locationState?.visibleSide) {
      navigate("/spell-check");
      return;
    }
    getCards({
      collectionIds: locationState.modules,
    });
  }, [navigate, locationState, getCards]);

  return {
    headerProps,
    error,
    collection,
    isLoading,
    borderType,
    isSummaryOpen: state.isSummaryModalOpen,
    index: state.index,
    visibleSide: locationState?.visibleSide || "word",
    rightAnswersCount: state.rightAnswersCounter,
    userMistakes: state.mistakesMadeIn,
    inProgress: state.inProgress,
    isMenuOptionsOpen: state.isMenuOptionsOpen,
    handleAnswer,
    resetTest,
    toggleMenu,
    closeMenu,
    toggleGroup,
    isGroupMuted,
  };
};
