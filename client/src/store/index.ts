import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth-slice";
import categoriesSlice from "./categories/categories-slice";
import timeRangesSlice from "./time-control/time-control-slice";
import todosSlice from "./todos/todos-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    categories: categoriesSlice.reducer,
    todos: todosSlice.reducer,
    timeRanges: timeRangesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
