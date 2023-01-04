import React from "react";
import { Button, Card } from "react-bootstrap";
import { useAppDispatch } from "../../hooks/redux";
import Todo from "../../models/todo";
import { removeTodoData } from "../../store/todos/todos-actions";
import classes from "./Todos.module.css";

const TodoCard: React.FC<React.PropsWithChildren<{ todo: Todo }>> = ({
  todo,
}) => {
  const dispatch = useAppDispatch();

  const deleteTodoHandle = async (event: React.FormEvent) => {
    event.preventDefault();
    todo && dispatch(removeTodoData(todo));
  };

  return (
    <Card className={`${classes.todoContainer} mb-3`}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <Card.Title>{todo.title}</Card.Title>
        <Button variant="danger" onClick={deleteTodoHandle}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TodoCard;
