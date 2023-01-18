import React, { useState, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import { useAppDispatch } from "../../../hooks/redux";
import useOutsideClick from "../../../hooks/useOutsideClick";
import CategoryModel from "../../../models/category";
import {
  editCategoryData,
  removeCategoryData,
} from "../../../store/categories/categories-actions";
import classes from "./Categories.module.css";

const Category: React.FC<
  React.PropsWithChildren<{
    category: CategoryModel;
  }>
> = ({ category }) => {
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);

  const editTitleRef = useRef<HTMLInputElement>(null);

  const editCategoryHandle = () => {
    console.log(category);
    setIsEdit(false);
    dispatch(
      editCategoryData({
        ...category,
        title: editTitleRef.current!.value,
      })
    );
  };

  useOutsideClick(editTitleRef, editCategoryHandle);

  const deleteCategoryHandle = async (event: React.FormEvent) => {
    event.preventDefault();
    category && dispatch(removeCategoryData(category));
  };

  return (
    <Card className={`${classes.categoryContainer} mb-3`}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <Card.Title className={classes.title}>
          {isEdit ? (
            <input
              autoFocus
              type="text"
              className={classes.editTitleInput}
              ref={editTitleRef}
              defaultValue={category.title}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editCategoryHandle();
                }
              }}
            />
          ) : (
            <div onClick={() => setIsEdit(!isEdit)}>{category.title}</div>
          )}
        </Card.Title>
        <Button variant="danger" onClick={deleteCategoryHandle}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Category;
