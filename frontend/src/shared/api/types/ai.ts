interface IGeneratedSentence {
  terms: string;
  sentence: string;
  translation: string;
}
export interface IGenerateSentencesRequest {
  id: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  cardSide: "word" | "translation";
  count: number;
}

export interface IGenerationResponse {
  sentences: IGeneratedSentence[];
}
