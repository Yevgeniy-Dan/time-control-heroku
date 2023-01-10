import React from "react";
import { useAppSelector } from "../../../hooks/redux";
import AddTodoForm from "./AddTodoForm";
import TodoCard from "./TodoCard";

const Todos: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const todos = useAppSelector((state) => state.todos);

  return (
    <div>
      <AddTodoForm />

      {todos.items.map((todo) => {
        return <TodoCard todo={todo} key={todo._id} />;
      })}

      {todos.items.length === 0 && (
        <h2 className="text-center m-5">Todos Not Found</h2>
      )}
    </div>
  );
};

export default Todos;
