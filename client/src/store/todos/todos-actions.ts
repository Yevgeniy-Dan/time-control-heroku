import { AppDispatch } from "..";
import api from "../../http";
import TodoModel from "../../models/todo";
import { todosActions } from "./todos-slice";

export const fetchTodosData = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await api.get("/admin/todos");

      const todos = response.data.todos;

      return todos;
    };

    try {
      const todosData: TodoModel[] = await fetchData();
      dispatch(
        todosActions.replaceTodos({
          items: todosData,
        })
      );
    } catch (error) {
      console.log("Some error: \n", error);
    }
  };
};

export const addTodoData = (todo: TodoModel) => {
  return async (dispatch: AppDispatch) => {
    const sendRequest = async () => {
      const addedItem = await api.post("/admin/add-todo", {
        title: todo.title,
        categoryId: todo.category?._id,
      });
      return addedItem.data;
    };
    try {
      const newItem = await sendRequest();
      dispatch(todosActions.addTodo({ item: newItem }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const removeTodoData = (todo: TodoModel) => {
  return async (dispatch: AppDispatch) => {
    const sendRequest = async () => {
      const response = await api.post("/admin/delete-todo", {
        todoId: todo._id,
        categoryId: todo.category?._id,
      });
      return response.data;
    };
    try {
      const removedItem = await sendRequest();
      dispatch(todosActions.removeTodo({ item: removedItem }));
    } catch (error) {
      console.log(error);
    }
  };
};
