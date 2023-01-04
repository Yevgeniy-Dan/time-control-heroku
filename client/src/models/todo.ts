class Todo {
  _id: string;
  title: string;
  categoryId: string | null;

  constructor(title: string, categoryId?: string) {
    this._id = new Date().toISOString();
    this.title = title;
    this.categoryId = categoryId || null;
  }
}

export default Todo;
