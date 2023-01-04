const Category = require("../models/category");
const Todo = require("../models/todo");

exports.getCategories = (req, res, next) => {
  Category.find().then((categories) => {
    res.json({
      categories: categories,
    });
  });
};

exports.getTodos = (req, res, next) => {
  Todo.find().then((todos) => {
    res.json({
      todos: todos,
    });
  });
};

exports.postAddCategory = (req, res, next) => {
  const title = req.body.title;

  const category = new Category({
    title: title,
    userId: req.user,
  });

  category
    .save()
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};

exports.postAddTodo = (req, res, next) => {
  const title = req.body.title;
  const categoryId = req.body.categoryId;

  const todo = new Todo({
    title: title,
    categoryId: categoryId || null,
    userId: req.user,
  });

  todo
    .save()
    .then((todo) => {
      req.user.addToTodoCart(todo);
      return res.json(todo);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};

exports.postDeleteCategory = (req, res, next) => {
  const categoryId = req.body.categoryId;
  Category.findByIdAndRemove(categoryId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.postDeleteTodo = (req, res, next) => {
  const todoId = req.body.todoId;
  Todo.findByIdAndRemove(todoId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};
