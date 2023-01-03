import { AppDispatch } from "..";
import api from "../../http";
import CategoryModel from "../../models/category";
import { categoriesActions } from "./categories-slice";

export const fetchCategoriesData = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await api.get("/admin/categories");

      const categories = response.data.categories;

      return categories;
    };

    try {
      const categoriesData: CategoryModel[] = await fetchData();

      dispatch(
        categoriesActions.replaceCategories({
          items: categoriesData,
        })
      );
    } catch (error) {
      console.log("Some error: \n", error);
    }
  };
};

export const addCategoryData = (category: CategoryModel) => {
  return async (dispatch: AppDispatch) => {
    const sendRequest = async () => {
      const addedItem = await api.post("/admin/add-category", {
        title: category.title,
      });

      return addedItem.data;
    };
    try {
      const newItem = await sendRequest();
      dispatch(categoriesActions.addCategoryToCategories({ item: newItem }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const removeCategoryData = (category: CategoryModel) => {
  return async (dispatch: AppDispatch) => {
    const sendRequest = async () => {
      const response = await api.post("/admin/delete-category", {
        categoryId: category._id,
      });

      return response.data;
    };
    try {
      const removedItem = await sendRequest();
      dispatch(
        categoriesActions.removeCategoryFromCategories({ item: removedItem })
      );
    } catch (error) {
      console.log(error);
    }
  };
};
