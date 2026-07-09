import { useGetCollectionsQuery } from "@entities/collection/api";
import { useModal } from "@widgets/modal";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";

export const useGrammarCheck = () => {
  const [chosenId, setChosenId] = useState<string>("");
  const [cardSide, setCardSide] = useState<"word" | "translation">("word");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [count, setCount] = useState<"5" | "7" | "10">("5");
  const { warning } = useModal();
  const navigate = useNavigate();
  const { data: collections, isLoading, error } = useGetCollectionsQuery();

  const headerProps = useMemo(
    () => ({
      title: "Грамматика",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: () => navigate("/dashboard"),
    }),
    [navigate],
  );

  const startTest = useCallback(() => {
    if (!chosenId) {
      warning("Ни одного модуля не выбрано!");
    } else {
      const numberCount = Number(count);
      navigate("/grammar-test", {
        state: { chosenId, cardSide, difficulty, numberCount },
      });
    }
  }, [warning, chosenId, cardSide, navigate, difficulty, count]);

  return {
    headerProps,
    chosenId,
    setChosenId,
    cardSide,
    setCardSide,
    collections,
    isLoading,
    error,
    startTest,
    difficulty,
    setDifficulty,
    count,
    setCount,
  };
};
