export interface IGenerateSentencesRequest {
  id: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  cardSide: "word" | "translation";
  count: number;
}

export interface IGeneratedSentence {
  term: string;
  sentence: string;
  translation: string;
}

export interface IGenerationResponse {
  sentences: IGeneratedSentence[];
}
