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

exports.postEditCategory = async (req, res, next) => {
  const categoryId = req.body.categoryId;
  const updatedTitle = req.body.title;

  try {
  } catch (err) {
    console.log(err);
  }

  const category = await Category.findById(categoryId);

  category.title = updatedTitle;
  await category.save();

  const todos = await Todo.find({ "category._id": categoryId });

  todos.map(async (t) => {
    t.category.title = category.title;
    await t.save();
  });

  return res.json(category);
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

exports.postAddTodo = async (req, res, next) => {
  const title = req.body.title;
  let categoryId = req.body.categoryId;

  try {
    let todo = new Todo({
      title: title,
      category: null,
      userId: req.user,
    });

    if (categoryId) {
      // const category = await Category.findOne({ title: "No Category" });

      // if (!category) {
      //   const noCategory = new Category({
      //     title: "No Category",
      //     color: "#0000004c",
      //     userId: req.user,
      //     todos: [],
      //   });

      //   const newCategory = await noCategory.save();
      //   categoryId = newCategory._id;
      // } else {
      //   categoryId = category._id;
      // }

      const category = await Category.findById(categoryId);

      todo.category = {
        title: category.title,
        _id: category._id,
      };

      await category.addTodoItem(todo);
    }

    const addedTodo = await todo.save();

    // req.user.addToTodoCart(todo);
    return res.json(addedTodo);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
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

exports.postDeleteTimeRange = (req, res, next) => {
  const id = req.body.timeRangeId;

  TimeRanges.findByIdAndRemove(id)
    .then((range) => {
      res.json(range);
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
