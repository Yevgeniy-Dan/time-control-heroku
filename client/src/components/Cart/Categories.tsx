import React, { useEffect, useRef } from "react";

import classes from "./Categories.module.css";
import CategoryModel from "../../models/category";
import Category from "./Category";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchCategoriesData,
  addCategoryData,
} from "../../store/categories/categories-actions";

const Categories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchCategoriesData());
  }, [dispatch]);

  const addCategoryHandle = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = titleRef.current!.value;

    const newCategory = new CategoryModel(title);

    dispatch(addCategoryData({ ...newCategory }));

    titleRef.current!.value = "";
  };

  return (
    <div>
      <div className={classes.categoryContainer}>
        <form onSubmit={addCategoryHandle} method="post">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Category Title
            </label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              id="title"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <button className="btn btn-warning" type="submit">
              Add Category
            </button>
          </div>
        </form>
      </div>

      {categories.items.map((c) => {
        return <Category category={c} key={c._id} />;
      })}

      {categories.items.length === 0 && <h2>Categories Not Found</h2>}
    </div>
  );
};

export default Categories;
