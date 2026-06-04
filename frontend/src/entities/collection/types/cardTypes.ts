import type { ICard } from "@shared/api";

export type EditableCardType = ICard & {
  isNew?: boolean;
  isUpdated?: boolean;
};
