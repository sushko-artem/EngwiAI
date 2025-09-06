export interface ICard {
  word: string;
  translation: string;
}

export interface ICollectionDto {
  name: string;
  cards: ICard[];
}

export interface ICollectionCardsResponse {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  cards: ICard[];
}

export interface ICollectionResponse {
  id: string;
  name: string;
}
