import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCollectionsQuery } from "@features/collections/api";
import { useModal } from "@widgets/modal";

export const useSpellCheck = () => {
  const navigate = useNavigate();
  const [chosenIds, setChosenIds] = useState<Set<string>>(new Set());
  const { warning } = useModal();
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

  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return {
    back,
    collections,
    isLoading,
    refetch,
    error,
    toggleChoosenModule,
    getChosenModulesIds,
    chosenIds,
    warning,
  };
};
