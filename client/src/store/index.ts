import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./categories/categories-slice";

const store = configureStore({
  reducer: {
    categories: categoriesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
