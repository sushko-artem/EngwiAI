export interface ICard {
  id: string;
  word: string;
  translation: string;
}

export interface ICollectionDto {
  name: string;
  cards: ICard[];
}

export interface IUpdateCollectionDto {
  newName?: string;
  updatedCards?: ICard[];
  newCards?: Array<{ word: string; translation: string }>;
  deletedCards?: string[];
}

export interface ICollectionCardsResponse {
  id: string;
  name: string;
  cards: ICard[];
}

export interface ICollectionResponse {
  id: string;
  name: string;
}
