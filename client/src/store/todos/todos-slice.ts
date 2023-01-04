import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TodoModel from "../../models/todo";

type InitialState = {
  items: TodoModel[];
};

const initialState: InitialState = {
  items: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState: initialState,
  reducers: {
    replaceTodos(state, action: PayloadAction<{ items: TodoModel[] }>) {
      state.items = action.payload.items;
    },
    addTodo(state, action: PayloadAction<{ item: TodoModel }>) {
      const newItem = action.payload.item;

      state.items.push({
        _id: newItem._id,
        title: newItem.title,
        categoryId: newItem?.categoryId,
      });
    },
    removeTodo(state, action: PayloadAction<{ item: TodoModel }>) {
      const id = action.payload.item._id;
      state.items = state.items.filter((item) => item._id !== id);
    },
  },
});

export const todosActions = todosSlice.actions;

export default todosSlice;
