import { useGetCollectionsQuery } from "@entities/collection/api";
import { useModal } from "@widgets/modal";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useGrammarCheck = () => {
  const [chosenId, setChosenId] = useState<string>("");
  const [visibleSide, setVisibleSide] = useState<"word" | "translation">(
    "word",
  );
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  );
  const [count, setCount] = useState<"5" | "7" | "10">("5");
  const { warning } = useModal();
  const navigate = useNavigate();
  const { data: collections, isLoading, error } = useGetCollectionsQuery();

  const handleBack = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const startTest = useCallback(() => {
    if (!chosenId) {
      warning("Ни одного модуля не выбрано!");
    } else {
      navigate("/grammar-check/test", {
        state: { chosenId, visibleSide, level, count },
      });
    }
  }, [warning, chosenId, visibleSide, navigate, level, count]);

  return {
    chosenId,
    setChosenId,
    visibleSide,
    setVisibleSide,
    collections,
    isLoading,
    error,
    handleBack,
    startTest,
    level,
    setLevel,
    count,
    setCount,
  };
};
