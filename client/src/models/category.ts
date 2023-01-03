class Category {
  _id: string;
  title: string;

  constructor(title: string) {
    this._id = new Date().toISOString();
    this.title = title;
  }
}

export default Category;
