import type {
  ICollectionCardsResponse,
  IUpdateCollectionDto,
} from "@shared/api";
import type { EditableCollectionType } from "@features/collections";

export const createUpdateDto = (
  originalCollection: ICollectionCardsResponse,
  editedCollection: EditableCollectionType,
  deletedCards: string[]
) => {
  const dto: Partial<IUpdateCollectionDto> = {};

  const updatedCards = editedCollection.cards
    .filter((card) => card.isUpdated)
    .map((card) => ({
      ...card,
      word: card.word.trim(),
      translation: card.translation.trim(),
    }));

  const newCards = editedCollection.cards
    .filter((card) => card.isNew)
    .map((card) => ({
      ...card,
      word: card.word.trim(),
      translation: card.translation.trim(),
    }));

  if (editedCollection.name.trim() !== originalCollection.name) {
    dto.newName = editedCollection.name.trim();
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
