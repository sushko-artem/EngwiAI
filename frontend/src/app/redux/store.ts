import { configureStore } from "@reduxjs/toolkit";
import { collectionReducer } from "@features/collections/model";
import { modalReducer } from "@entities/modal/model";
import { api } from "@shared/api";
import { modalMiddleware } from "@widgets/modal";

export const store = configureStore({
  reducer: {
    collections: collectionReducer,
    modal: modalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, modalMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
