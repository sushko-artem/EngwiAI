import { useGenerateSentencesMutation } from "@features/grammar-test/api/ai-api";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useGrammarTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [generateSentences, { data: sentences, isLoading, error }] =
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

  return {
    sentences,
    isLoading,
    error,
  };
};
