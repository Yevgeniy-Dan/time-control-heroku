import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CategoryModel from "../../models/category";

type InitialState = {
  items: CategoryModel[];
};

const initialState: InitialState = {
  items: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    replaceCategories(
      state,
      action: PayloadAction<{ items: CategoryModel[] }>
    ) {
      state.items = action.payload.items;
    },
    addCategoryToCategories(
      state,
      action: PayloadAction<{ item: CategoryModel }>
    ) {
      const newItem = action.payload.item;

      state.items.push({
        _id: newItem._id,
        title: newItem.title,
        todos: null,
      });
    },
    editCategory(state, action: PayloadAction<{ item: CategoryModel }>) {
      const editItem = state.items.filter(
        (c) => c._id === action.payload.item._id
      )[0];

      editItem.title = action.payload.item.title;
    },
    removeCategoryFromCategories(
      state,
      action: PayloadAction<{ item: CategoryModel }>
    ) {
      const id = action.payload.item._id;
      state.items = state.items.filter((item) => item._id !== id);
    },
  },
});

export const categoriesActions = categoriesSlice.actions;

export default categoriesSlice;
