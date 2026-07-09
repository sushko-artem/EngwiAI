import type { ICard } from "@shared/api";

export type CardSideType = "word" | "translation";

export type EditableCardType = ICard & {
  isNew?: boolean;
  isUpdated?: boolean;
};
