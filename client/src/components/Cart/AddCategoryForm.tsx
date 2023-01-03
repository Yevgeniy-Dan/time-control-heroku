import React, { useRef } from "react";
import { useAppDispatch } from "../../hooks/redux";

import CategoryModel from "../../models/category";
import { addCategoryData } from "../../store/categories/categories-actions";
import classes from "./Categories.module.css";

const AddCategoryForm: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const dispatch = useAppDispatch();

  const titleRef = useRef<HTMLInputElement>(null);

  const addCategoryHandle = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = titleRef.current!.value;

    const newCategory = new CategoryModel(title);

    dispatch(addCategoryData({ ...newCategory }));

    titleRef.current!.value = "";
  };
  return (
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
  );
};

export default AddCategoryForm;
