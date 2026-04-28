import { useCallback, useState } from "react";
import { useGetCollectionsQuery } from "@features/collections/api";
import { useModal } from "@widgets/modal";
import { useNavigate } from "react-router-dom";

export const useSpellCheck = () => {
  const [chosenIds, setChosenIds] = useState<Set<string>>(new Set());
  const [visibleSide, setVisibleSide] = useState<"word" | "translation">(
    "word",
  );
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

  const handleBack = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const getChosenModulesIds = useCallback(() => {
    return Array.from(chosenIds);
  }, [chosenIds]);

  const startTest = useCallback(async () => {
    const modules = getChosenModulesIds();
    if (!modules.length) {
      warning("Ни одного модуля не выбрано!");
    } else {
      navigate("/spell-check/test", { state: { modules, visibleSide } });
    }
  }, [getChosenModulesIds, warning, navigate, visibleSide]);

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
    handleBack,
  };
};
