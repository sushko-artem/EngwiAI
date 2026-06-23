import type { IGenerationResponse } from "@shared/api";
import { shuffler } from "@shared/helpers";

export const transformDataForTest = (data: IGenerationResponse) => {
  const sentences = data.sentences.map(
    (item) => item.sentence.match(/\p{L}+/gu) || [],
  );
  const joinedSentences = sentences.flatMap((item) => item.join(" "));
  const translations = data.sentences.map((item) => item.translation);
  const shuffledSentences = sentences.map(shuffler);

  return {
    joinedSentences,
    shuffledSentences,
    translations,
  };
};

export type GrammarDataType = ReturnType<typeof transformDataForTest>;
