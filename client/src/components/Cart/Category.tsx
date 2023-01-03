import React from "react";
import { useAppDispatch } from "../../hooks/redux";
import CategoryModel from "../../models/category";
import { removeCategoryData } from "../../store/categories/categories-actions";

const Category: React.FC<
  React.PropsWithChildren<{
    category: CategoryModel;
  }>
> = ({ category }) => {
  const dispatch = useAppDispatch();
  const deleteCategoryHandle = async (event: React.FormEvent) => {
    event.preventDefault();
    category && dispatch(removeCategoryData(category));
  };

  return (
    <div>
      <p>{category.title}</p>
      <form onSubmit={deleteCategoryHandle} method="post">
        <input type="hidden" value={category._id} />
        <button type="submit">Delete</button>
      </form>
    </div>
  );
};

export default Category;
