const qs = require("qs");
const randomColor = require("randomcolor");
const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const Todo = require("../models/todo");
const TimeRanges = require("../models/time-range");

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ userId: req.user._id });

  res.status(200).json({
    categories: categories,
  });
});

exports.getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id });

  res.status(200).json({
    todos: todos,
  });
});

exports.getTimeRanges = asyncHandler(async (req, res, next) => {
  const ranges = await TimeRanges.find({ userId: req.user._id });

  res.status(200).json({
    timeRanges: ranges,
  });
});

exports.postEditCategory = asyncHandler(async (req, res, next) => {
  const { categoryId, title } = req.body;

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (category.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  category.title = title;

  await category.save();

  const todos = await Todo.find({ "category._id": categoryId });
  todos.map(async (t) => {
    t.category.title = category.title;
    await t.save();
  });

  res.status(200).json(category);
});

exports.postAddCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const color = randomColor();

  const category = await Category.create({
    title: title,
    userId: req.user._id,
    color: color,
  });

  res.status(200).json(category);
});

exports.postAddTodo = asyncHandler(async (req, res) => {
  const { title } = req.body;
  let { categoryId } = req.body;

  let todo = new Todo({
    title: title,
    category: null,
    userId: req.user._id,
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

    if (category) {
      todo.category = {
        title: category.title,
        _id: category._id,
      };

      await category.addTodoItem(todo);
    }
  }

  const addedTodo = await todo.save();

  // req.user.addToTodoCart(todo);
  res.status(200).json(addedTodo);
});

exports.postAddTimeRange = asyncHandler(async (req, res) => {
  const category = qs.parse(req.body.category);
  const todo = qs.parse(req.body.todo);
  const dates = qs.parse(req.body.dates);

  const newTime = new TimeRanges({
    category: category,
    todo: todo,
    startDate: dates.startDate,
    endDate: dates.endDate,
    userId: req.user._id,
  });

  await newTime.save();

  res.status(200).json(newTime);
});

exports.postDeleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (category.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const removedCategory = await category.remove();

  const todos = await Todo.find({ "category.categoryId: ": categoryId });

  todos.map((t) => {
    t.category = null;
    t.save();
  });

  res.status(200).json(removedCategory);
});

exports.postDeleteTodo = asyncHandler(async (req, res) => {
  const { todoId, categoryId } = req.body;

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  const removedTodo = await Todo.findById(todoId);

  if (removedTodo.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await removedTodo.remove();

  if (categoryId) {
    const category = await Category.findById(categoryId)
      .populate("todos")
      .exec();

    const updatedTodos = category.todos.filter((c) => {
      return c.todoId.toString() !== todoId.toString();
    });
    category.todos = updatedTodos;
    await category.save();
  }

  res.status(200).json(removedTodo);
});

exports.postDeleteTimeRange = asyncHandler(async (req, res) => {
  const id = req.body.timeRangeId;

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  const timeRange = await TimeRanges.findById(id);

  if (timeRange.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const removedTimeRange = await timeRange.remove();

  res.status(200).json(removedTimeRange);
});
