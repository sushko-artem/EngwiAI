import { type Middleware } from "@reduxjs/toolkit";
import { clearCollection, COLLECTIONS_DRAFT_KEY } from "../collections.slice";

export const persistCollectionMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    if (!clearCollection.match(action)) {
      const state = store.getState().collections;
      if (state.editableCollection) {
        sessionStorage.setItem(
          COLLECTIONS_DRAFT_KEY,
          JSON.stringify({
            editableCollection: state.editableCollection,
            deletedCards: state.deletedCards,
            mode: state.mode,
          }),
        );
      }
    }
    return result;
  };
