import Category from "../models/category";

export interface TodoOption {
  readonly value: string;
  readonly label: string;
  readonly categoryTitle: string;
  readonly categoryId: string;
}

export interface GroupedOption {
  readonly label: string;
  readonly options: readonly TodoOption[];
}

export const groupedOptions = (
  categories: Category[]
): readonly GroupedOption[] => {
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
