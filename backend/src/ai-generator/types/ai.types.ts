export interface GeneratedSentence {
  terms: string;
  sentence: string;
  translation: string;
}

export interface AIGenerationResult {
  sentences: GeneratedSentence[];
}
