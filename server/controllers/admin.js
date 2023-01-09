const qs = require("qs");

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

  Category.findById(categoryId).then((category) => {
    let todo = new Todo({
      title: title,
      userId: req.user,
    });

    if (category) {
      todo.category = {
        title: category.title,
        categoryId: category,
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

  // Category.populate("todos.items.todoId")
  //   .execPopulate()
  //   .then((category) => {
  //     const todos = category.todos.items.map((t) => {
  //       return t.todoId.toString() === todoId.toString();
  //     });

  //     console.log(category);

  //     if (todos.length > 0) {
  //       todos[0].removeTodoItem(todoId);
  //     }
  //   });

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
    time: time.value,
  });

  newTime.save().then((item) => {
    res.json({ ...item, time: item.time });
  });
};
