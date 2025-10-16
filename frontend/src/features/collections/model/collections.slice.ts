import type { EditableCardType } from "@entities/editableCollection";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

type CollectionType = {
  name: string;
  cards: EditableCardType[];
};

interface ICollectionState {
  editableCollection: CollectionType | null;
  mode: "create" | "edit" | null;
}

const initialState: ICollectionState = {
  editableCollection: null,
  mode: null,
};

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    initDefaultCollection: (state) => {
      state.editableCollection = {
        name: "",
        cards: [
          { id: nanoid(), word: "", translation: "" },
          { id: nanoid(), word: "", translation: "" },
        ],
      };
      state.mode = "create";
    },
    clearCollection: (state) => {
      state.editableCollection = null;
      state.mode = null;
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
      state.editableCollection.cards = state.editableCollection.cards.filter(
        (card) => card.id !== action.payload
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
      }>
    ) => {
      if (!state.editableCollection) return;
      const { id, value, field } = action.payload;
      const card = state.editableCollection.cards.find(
        (card) => card.id === id
      );
      if (card) {
        card[field] = value;
        if (state.mode === "edit") {
          card.isUpdated = true;
        }
      }
    },
  },
});

export const {
  initDefaultCollection,
  clearCollection,
  addCard,
  updateCollectionName,
  updateCard,
  deleteCard,
} = collectionsSlice.actions;
export default collectionsSlice.reducer;
