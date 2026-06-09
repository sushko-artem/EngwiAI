export interface GeneratedSentence {
  term: string;
  sentence: string;
  translation: string;
}

export interface AIGenerationResult {
  sentences: GeneratedSentence[];
}
