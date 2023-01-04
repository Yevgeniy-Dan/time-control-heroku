import Category from "./category";

class Todo {
  _id: string;
  title: string;
  category: Category | null;

  constructor(title: string, category: Category | null) {
    this._id = new Date().toISOString();
    this.title = title;
    this.category = category || null;
  }
}

export default Todo;
