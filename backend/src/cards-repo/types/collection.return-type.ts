import { CardStatus } from '@generated/prisma/enums';

export interface CollectionWithCards {
  id: string;
  name: string;
  cards: {
    id: string;
    word: string;
    translation: string;
    status: CardStatus;
  }[];
}
