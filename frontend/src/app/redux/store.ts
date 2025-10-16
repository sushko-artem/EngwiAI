import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/model/auth.slice";
import collectionReducer from "@features/collections/model/collections.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
