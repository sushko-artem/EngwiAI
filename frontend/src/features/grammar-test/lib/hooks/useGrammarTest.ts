import { useGenerateSentencesMutation } from "@features/grammar-test/api/ai-api";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { transformDataForTest } from "../helpers";

export const useGrammarTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [generateSentences, { data, isLoading, error }] =
    useGenerateSentencesMutation();

  useEffect(() => {
    if (!location.state?.chosenId) {
      navigate("/grammar-check");
      return;
    }
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
    });
  }, [location.state, navigate, generateSentences]);

  const processedSentences = useMemo(() => {
    if (!data?.sentences) return null;
    return transformDataForTest(data);
  }, [data]);

  return {
    sentences: processedSentences,
    isLoading,
    error,
  };
};
