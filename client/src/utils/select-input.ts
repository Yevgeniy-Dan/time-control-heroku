import Category from "../models/category";
import Todo from "../models/todo";

export interface TodoOption {
  value: string;
  label: string;
  categoryTitle: string | null;
  categoryId: string | null;
}

export interface GroupedOption {
  label: string;
  options: TodoOption[];
}

export const groupedOptions = (
  categories: Category[],
  todos: Todo[]
): GroupedOption[] => {
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

  const todoOptions: TodoOption[] = todos
    .filter((t) => !t.category)
    .map((t) => {
      return {
        value: t._id,
        label: t.title,
        categoryId: null,
        categoryTitle: null,
      };
    });

  groupedOptions.push({
    label: "Without Category",
    options: todoOptions,
  });

  groupedOptions = groupedOptions.filter((option) => {
    return option.label.length > 0 && option.options.length > 0;
  });
  return groupedOptions;
};
