import type { IGenerationResponse } from "@shared/api";
import { shuffler } from "@shared/helpers";

export const transformDataForTest = (data: IGenerationResponse) => {
  const splitedSentences = data.sentences.map(
    (item) => item.sentence.match(/\p{L}+/gu) || [],
  );
  const translations = data.sentences.map((item) => item.translation);
  const shuffledSentences = splitedSentences.map(shuffler);

  return {
    splitedSentences,
    shuffledSentences,
    translations,
  };
};
