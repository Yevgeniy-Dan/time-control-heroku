import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./categories/categories-slice";
import todosSlice from "./todos/todos-slice";

const store = configureStore({
  reducer: {
    categories: categoriesSlice.reducer,
    todos: todosSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
