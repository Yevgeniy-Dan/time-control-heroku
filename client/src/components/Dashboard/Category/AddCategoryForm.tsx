import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useAppDispatch } from "../../../hooks/redux";
import CategoryModel from "../../../models/category";
import { addCategoryData } from "../../../store/categories/categories-actions";
import classes from "./Categories.module.css";

const AddCategoryForm: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [validated, setValidated] = useState(false);

  const dispatch = useAppDispatch();

  const titleRef = useRef<HTMLInputElement>(null);

  const addCategoryHandle = async (event: React.FormEvent) => {
    setValidated(true);
    event.preventDefault();

    const title = titleRef.current!.value;

    const form = event.currentTarget;

    if ((form as HTMLButtonElement).checkValidity() === false) {
      event.stopPropagation();
    } else {
      const newCategory = new CategoryModel(title);

      dispatch(addCategoryData({ ...newCategory }));

      titleRef.current!.value = "";
      setValidated(false);
    }
  };
  return (
    <div className={classes.categoryContainer}>
      <Form
        noValidate
        validated={validated}
        onSubmit={addCategoryHandle}
        method="post"
      >
        <Form.Group className="mb-3" controlId="validation">
          <Form.Label>Category Title</Form.Label>
          <Form.Control required ref={titleRef} type="text" />
          <Form.Control.Feedback type="invalid">
            Don't forget to write a category
          </Form.Control.Feedback>
        </Form.Group>
        <div className="mb-3">
          <Button variant="warning" type="submit">
            Add Category
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCategoryForm;
