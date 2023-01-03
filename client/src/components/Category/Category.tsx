import React from "react";
import { Button, Card } from "react-bootstrap";
import { useAppDispatch } from "../../hooks/redux";
import CategoryModel from "../../models/category";
import { removeCategoryData } from "../../store/categories/categories-actions";
import classes from "./Categories.module.css";

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
    <Card className={`${classes.categoryContainer} mb-3`}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <Card.Title>{category.title}</Card.Title>
        <Button variant="danger" onClick={deleteCategoryHandle}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Category;
