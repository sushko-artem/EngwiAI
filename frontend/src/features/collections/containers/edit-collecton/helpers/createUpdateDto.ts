import type { EditableCardType } from "@entities/editableCollection";
import type {
  ICollectionCardsResponse,
  IUpdateCollectionDto,
} from "@shared/api";

export const createUpdateDto = (
  originalCollection: ICollectionCardsResponse,
  editedCollection: { name: string; cards: EditableCardType[] },
  deletedCards: string[]
) => {
  const dto: Partial<IUpdateCollectionDto> = {};

  const updatedCards = editedCollection.cards.filter((card) => card.isUpdated);
  const newCards = editedCollection.cards.filter((card) => card.isNew);

  if (editedCollection.name !== originalCollection.name) {
    dto.newName = editedCollection.name;
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
