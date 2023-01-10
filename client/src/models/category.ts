class Category {
  _id: string;
  title: string;
  todos:
    | {
        todoId: string;
        title: string;
      }[]
    | null;
  color: string;

  constructor(
    title: string,
    categoryTodos?: [{ todoId: string; title: string }]
  ) {
    this._id = new Date().toISOString();
    this.title = title;
    this.todos = categoryTodos || null;
  }
}

export default Category;
