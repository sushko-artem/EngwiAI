import { useGetCollectionsQuery } from "@entities/collection/api";
import { useModal } from "@widgets/modal";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useGrammarCheck = () => {
  const [chosenId, setChosenId] = useState<string>("");
  const [visibleSide, setVisibleSide] = useState<"word" | "translation">(
    "word",
  );
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
      navigate("/grammar-check/test", { state: { chosenId, visibleSide } });
    }
  }, [warning, chosenId, visibleSide, navigate]);

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
  };
};
