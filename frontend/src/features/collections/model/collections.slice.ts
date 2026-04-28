import type { EditableCardType } from "@features/collections/ui";
import type { RootState } from "@redux/store";
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export const COLLECTIONS_DRAFT_KEY = "collections_draft";

export type EditableCollectionType = {
  name: string;
  cards: EditableCardType[];
};

interface ICollectionState {
  editableCollection: EditableCollectionType | null;
  deletedCards: Array<string>;
  mode: "create" | "edit" | null;
}

const initialState: ICollectionState = {
  editableCollection: null,
  deletedCards: [],
  mode: null,
};

const loadFromSessionStorage = (): ICollectionState => {
  const saved = sessionStorage.getItem(COLLECTIONS_DRAFT_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return {
      editableCollection: parsed.editableCollection,
      deletedCards: parsed.deletedCards,
      mode: parsed.mode,
    };
  }
  return initialState;
};

const collectionsSlice = createSlice({
  name: "collections",
  initialState: loadFromSessionStorage(),
  reducers: {
    initDefaultCollection: (state) => {
      if (state.editableCollection) return;
      state.editableCollection = {
        name: "",
        cards: [
          { id: nanoid(), word: "", translation: "" },
          { id: nanoid(), word: "", translation: "" },
        ],
      };
      state.deletedCards = [];
      state.mode = "create";
    },
    setExistedCollection: (
      state,
      action: PayloadAction<EditableCollectionType>,
    ) => {
      if (state.editableCollection) return;
      state.editableCollection = {
        name: action.payload.name,
        cards: action.payload.cards,
      };
      state.mode = "edit";
    },
    clearCollection: (state) => {
      state.editableCollection = null;
      state.deletedCards = [];
      state.mode = null;
      sessionStorage.removeItem(COLLECTIONS_DRAFT_KEY);
    },
    addCard: (state) => {
      if (!state.editableCollection) return;
      const newCard: EditableCardType = {
        id: nanoid(),
        word: "",
        translation: "",
      };
      if (state.mode === "edit") {
        newCard.isNew = true;
        state.editableCollection.cards.push(newCard);
      } else {
        state.editableCollection.cards.push(newCard);
      }
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      if (!state.editableCollection) return;
      state.deletedCards.push(action.payload);
      state.editableCollection.cards = state.editableCollection.cards.filter(
        (card) => card.id !== action.payload,
      );
    },
    updateCollectionName: (state, action: PayloadAction<string>) => {
      if (!state.editableCollection) return;
      state.editableCollection.name = action.payload;
    },
    updateCard: (
      state,
      action: PayloadAction<{
        value: string;
        id: string;
        field: "word" | "translation";
      }>,
    ) => {
      if (!state.editableCollection) return;
      const { id, value, field } = action.payload;
      const card = state.editableCollection.cards.find(
        (card) => card.id === id,
      );
      if (card) {
        card[field] = value;
        if (state.mode === "edit" && !card.isNew) {
          card.isUpdated = true;
        }
      }
    },
  },
});

export const selectEditableCollection = (state: RootState) =>
  state.collections.editableCollection;

export const selectDeletedCards = (state: RootState) =>
  state.collections.deletedCards;

export const selectEditCollectionState = createSelector(
  selectEditableCollection,
  selectDeletedCards,
  (editableCollection, deletedCards) => ({
    editableCollection,
    deletedCards,
  }),
);

export const {
  initDefaultCollection,
  setExistedCollection,
  clearCollection,
  addCard,
  updateCollectionName,
  updateCard,
  deleteCard,
} = collectionsSlice.actions;
export default collectionsSlice.reducer;
