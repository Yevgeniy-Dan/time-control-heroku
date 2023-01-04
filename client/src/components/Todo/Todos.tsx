import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchTodosData } from "../../store/todos/todos-actions";
import AddTodoForm from "./AddTodoForm";
import TodoModel from "./Todo";

const Todos: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodosData());
  }, [dispatch]);

  return (
    <div>
      <AddTodoForm />

      {todos.items.map((todo) => {
        return <TodoModel todo={todo} key={todo._id} />;
      })}

      {todos.items.length === 0 && (
        <h2 className="text-center m-5">Todos Not Found</h2>
      )}
    </div>
  );
};

export default Todos;
