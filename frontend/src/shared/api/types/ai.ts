import type { CardSideType } from "@entities/collection/types";

interface IGeneratedSentence {
  terms: string;
  sentence: string;
  translation: string;
}
export type DifficultyGenerationType = "beginner" | "intermediate" | "advanced";

export type GenerationCountType = "5" | "7" | "10";
export interface IGenerateSentencesRequest {
  id: string;
  difficulty: DifficultyGenerationType;
  cardSide: CardSideType;
  count: number;
}

export interface IGenerationResponse {
  sentences: IGeneratedSentence[];
}
