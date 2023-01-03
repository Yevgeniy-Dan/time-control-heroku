import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CategoryModel from "../../models/category";

type InitialState = {
  items: CategoryModel[];
  changed: boolean;
};

const initialState: InitialState = {
  items: [],
  changed: false,
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
      state.changed = true;

      const newItem = action.payload.item;

      state.items.push({
        _id: newItem._id,
        title: newItem.title,
      });
    },
    removeCategoryFromCategories(
      state,
      action: PayloadAction<{ item: CategoryModel }>
    ) {
      state.changed = true;

      const id = action.payload.item._id;
      state.items = state.items.filter((item) => item._id !== id);
    },
  },
});

export const categoriesActions = categoriesSlice.actions;

export default categoriesSlice;
