import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CategoryModel from "../../models/category";

type InitialState = {
  items: CategoryModel[];
  isReplaced: boolean;
};

const initialState: InitialState = {
  items: [],
  isReplaced: false,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    reset: () => initialState,
    replaceCategories(
      state,
      action: PayloadAction<{ items: CategoryModel[] }>
    ) {
      state.items = action.payload.items;
      state.isReplaced = true;
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
        color: newItem.color,
      });
    },
    editCategory(state, action: PayloadAction<{ item: CategoryModel }>) {
      state.items = state.items.map((c) => {
        if (c._id === action.payload.item._id) {
          return { ...action.payload.item };
        }
        return { ...c };
      });
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
