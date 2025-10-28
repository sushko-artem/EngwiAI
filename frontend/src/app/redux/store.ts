import { configureStore } from "@reduxjs/toolkit";
import { collectionReducer } from "@features/collections";
import { api } from "@shared/api";

export const store = configureStore({
  reducer: {
    collections: collectionReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
