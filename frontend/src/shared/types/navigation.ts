import type { CardSideType } from "@entities/collection/types";
import type { DifficultyGenerationType } from "@shared/api";

export type GrammarTestNavigationState = {
  chosenId: string;
  difficulty: DifficultyGenerationType;
  cardSide: CardSideType;
  numberCount: number;
};

export type SpellTestNavigationState = {
  modules: string[];
  visibleSide: CardSideType;
};
