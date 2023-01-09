import Category from "../models/category";
import Todo from "../models/todo";

export interface TodoOption {
  value: string;
  label: string;
  categoryTitle: string;
  categoryId: string;
}

export const todoOptions = (todos: Todo[]): TodoOption[] => {
  return todos.map((t) => {
    return {
      value: t._id,
      label: t.title,
      categoryId: "",
      categoryTitle: "",
    };
  });
};

export interface GroupedOption {
  label: string;
  options: TodoOption[];
}

export const groupedOptions = (categories: Category[]): GroupedOption[] => {
  let groupedOptions: GroupedOption[] = categories.map((c) => {
    if (c.todos) {
      const categoryOptions: TodoOption[] = c.todos.map((todo) => {
        return {
          value: todo.todoId,
          label: todo.title.toUpperCase(),
          categoryTitle: c.title,
          categoryId: c._id,
        };
      });

      return {
        label: `${c.title}`,
        options: categoryOptions,
      };
    }

    return {
      label: "",
      options: [],
    };
  });

  groupedOptions = groupedOptions.filter((option) => {
    return option.label.length > 0 && option.options.length > 0;
  });
  return groupedOptions;
};
