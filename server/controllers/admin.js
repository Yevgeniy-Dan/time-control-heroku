const qs = require("qs");
const randomColor = require("randomcolor");

const Category = require("../models/category");
const Todo = require("../models/todo");
const TimeRanges = require("../models/time-range");

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

exports.getTimeRanges = (req, res, next) => {
  TimeRanges.find().then((ranges) => {
    res.json({
      timeRanges: ranges,
    });
  });
};

exports.postEditCategory = (req, res, next) => {
  const categoryId = req.body.categoryId;
  const updatedTitle = req.body.title;

  Category.findById(categoryId)
    .then((category) => {
      category.title = updatedTitle;
      return category.save();
    })
    .then((editItem) => {
      Todo.find({ "category.categoryId": categoryId }).then((todos) => {
        todos.map((t) => {
          t.category.title = editItem.title;
          t.save();
        });
      });
      res.json(editItem);
    })
    .catch((err) => console.log(err));
};

exports.postAddCategory = (req, res, next) => {
  const title = req.body.title;

  const color = randomColor();

  const category = new Category({
    title: title,
    userId: req.user,
    color: color,
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

  Category.findById(categoryId).then((category) => {
    let todo = new Todo({
      title: title,
      userId: req.user,
    });

    if (category) {
      todo.category = {
        title: category.title,
        _id: category._id,
      };

      category.addTodoItem(todo);
    }

    todo
      .save()
      .then((todo) => {
        // req.user.addToTodoCart(todo);
        return res.json(todo);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  });
};

exports.postDeleteCategory = (req, res, next) => {
  const categoryId = req.body.categoryId;
  Category.findByIdAndRemove(categoryId)
    .then((deletedCategory) => {
      Todo.find({ "category.categoryId:": categoryId }).then((todos) => {
        todos.map((t) => {
          t.category = null;
          t.save();
        });
      });
      res.json(deletedCategory);
    })
    .catch((err) => console.log(err));
};

exports.postDeleteTodo = (req, res, next) => {
  const todoId = req.body.todoId;
  const categoryId = req.body.categoryId;

  if (categoryId) {
    Category.findById(categoryId)
      .populate("todos")
      .exec()
      .then((categories) => {
        const updatedTodos = categories.todos.filter((c) => {
          return c.todoId.toString() !== todoId.toString();
        });
        categories.todos = updatedTodos;
        categories.save();
      });
  }

  Todo.findByIdAndRemove(todoId)
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) => console.log(err));
};

exports.postAddTimeRange = (req, res, next) => {
  const category = qs.parse(req.body.category);
  const todo = qs.parse(req.body.todo);
  const time = qs.parse(req.body.time);

  const newTime = new TimeRanges({
    category: category,
    todo: todo,
    time: {
      ms: time.ms,
      percent: time.percent,
    },
  });

  newTime.save().then((item) => {
    res.json(item);
  });
};
