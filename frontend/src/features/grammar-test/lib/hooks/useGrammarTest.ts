import { useGenerateSentencesMutation } from "@features/grammar-test/api/ai-api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { IGenerationResponse } from "shared/api";

export const useGrammarTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sentences, setSentences] = useState<IGenerationResponse | undefined>(
    undefined,
  );
  const [generateSentences, { isLoading, error }] =
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
    async function generate() {
      try {
        const result = await generateSentences({
          id,
          difficulty,
          cardSide,
          count,
        }).unwrap();
        setSentences(result);
      } catch (error) {
        console.error(error);
      }
    }
    generate();
  }, [location.state, navigate, generateSentences]);

  return {
    sentences,
    isLoading,
    error,
  };
};
