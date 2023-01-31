import { AppDispatch } from "..";
import api from "../../http";
import TodoModel from "../../models/todo";
import { categoriesActions } from "../categories/categories-slice";
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
      const response = await api.post("/admin/add-todo", {
        title: todo.title,
        categoryId: todo.category?._id,
      });
      return response.data;
    };
    try {
      const response = await sendRequest();
      dispatch(todosActions.addTodo({ item: response.todo }));
      if (response.category) {
        dispatch(categoriesActions.editCategory({ item: response.category }));
      }
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
      const response = await sendRequest();
      dispatch(todosActions.removeTodo({ item: response.todo }));
      if (response.category) {
        dispatch(categoriesActions.editCategory({ item: response.category }));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
