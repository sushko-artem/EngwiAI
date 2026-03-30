export interface ICard {
  id: string;
  status?: "ACTIVE" | "INACTIVE";
  word?: string;
  translation?: string;
}

export interface ICollectionDto {
  name: string;
  cards: ICard[];
}

export interface IUpdateCollectionDto {
  newName?: string;
  updatedCards?: ICard[];
  newCards?: Omit<ICard, "id">[];
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
