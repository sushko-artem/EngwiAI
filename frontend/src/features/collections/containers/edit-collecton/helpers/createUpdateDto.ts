import type {
  ICard,
  ICollectionCardsResponse,
  IUpdateCollectionDto,
} from "@shared/api";

export const createUpdateDto = (
  originalCollection: ICollectionCardsResponse,
  editedName: string,
  updatedCards: ICard[],
  newCards: Array<{ word: string; translation: string }>,
  deletedCards: string[]
) => {
  const dto: Partial<IUpdateCollectionDto> = {};

  if (editedName !== originalCollection.name) {
    dto.newName = editedName;
  }

  if (updatedCards.length > 0) {
    dto.updatedCards = updatedCards;
  }

  if (newCards.length > 0) {
    dto.newCards = newCards;
  }

  if (deletedCards.length > 0) {
    dto.deletedCards = deletedCards;
  }

  return dto;
};
