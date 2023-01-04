import React, { useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import CategoryModel from "../../models/category";
import TodoModel from "../../models/todo";

import { useAppDispatch } from "../../hooks/redux";
import { addTodoData } from "../../store/todos/todos-actions";

import AppBadge from "../UI/AppBadge";
import SelectCategory from "../UI/SelectCategory";
import classes from "./Todos.module.css";

const AddTodoForm: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const titleRef = useRef<HTMLInputElement>(null);

  const [categoriesShow, setCategoriesShow] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryModel | null>(null);
  const [validated, setValidated] = useState(false);

  const dispatch = useAppDispatch();

  const addTodoHandle = async (event: React.FormEvent) => {
    setValidated(true);
    event.preventDefault();

    const title = titleRef.current!.value;

    const form = event.currentTarget;

    if ((form as HTMLButtonElement).checkValidity() === false) {
      event.stopPropagation();
    } else {
      const newTodo = new TodoModel(title, selectedCategory?._id);

      dispatch(addTodoData({ ...newTodo }));

      titleRef.current!.value = "";
      setSelectedCategory(null);
      setValidated(false);
    }
  };

  return (
    <div className={classes.todoContainer}>
      <Form
        noValidate
        validated={validated}
        onSubmit={addTodoHandle}
        method="post"
      >
        <Form.Group className="mb-3" controlId="validation">
          <Form.Label>Todo Title</Form.Label>
          <InputGroup>
            <Form.Control
              className={classes.todoInput}
              required
              ref={titleRef}
              type="text"
            />
            <AppBadge
              onClick={() => setCategoriesShow(!categoriesShow)}
              title={selectedCategory?.title || "Select"}
            />
            <SelectCategory
              show={categoriesShow}
              onClose={() => setCategoriesShow(false)}
              selected={selectedCategory}
              onSelect={(c) => setSelectedCategory(c)}
            />
            <Form.Control.Feedback type="invalid">
              Don't forget to write a todo
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <div className="mb-3">
          <Button variant="warning" type="submit">
            Add Todo
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddTodoForm;
