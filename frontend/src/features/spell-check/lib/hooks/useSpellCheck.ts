import { useCallback, useMemo, useState } from "react";
import { useGetCollectionsQuery } from "@entities/collection/api";
import { useModal } from "@widgets/modal";
import { useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";
import type { CardSideType } from "@entities/collection/types";
import type { SpellTestNavigationState } from "shared/types";

export const useSpellCheck = () => {
  const [chosenIds, setChosenIds] = useState<Set<string>>(new Set());
  const [visibleSide, setVisibleSide] = useState<CardSideType>("word");
  const { warning } = useModal();
  const navigate = useNavigate();
  const {
    data: collections,
    isLoading,
    refetch,
    error,
  } = useGetCollectionsQuery();

  const toggleChoosenModule = useCallback((id: string) => {
    setChosenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const getChosenModulesIds = useCallback(() => {
    return Array.from(chosenIds);
  }, [chosenIds]);

  const startTest = useCallback(() => {
    const modules = getChosenModulesIds();
    if (!modules.length) {
      warning("Ни одного модуля не выбрано!");
    } else {
      navigate("/spell-check/test", {
        state: { modules, visibleSide } satisfies SpellTestNavigationState,
      });
    }
  }, [getChosenModulesIds, warning, navigate, visibleSide]);

  const headerProps = useMemo(
    () => ({
      title: "Орфография",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: () => navigate("/dashboard"),
    }),
    [navigate],
  );

  return {
    collections,
    isLoading,
    refetch,
    error,
    toggleChoosenModule,
    chosenIds,
    visibleSide,
    setVisibleSide,
    startTest,
    headerProps,
  };
};
