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
  let updatedCategory;

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

      updatedCategory = await category.addTodoItem(todo);
    }
  }

  const addedTodo = await todo.save();

  // req.user.addToTodoCart(todo);
  res.status(200).json({
    todo: addedTodo,
    category: updatedCategory,
  });
});

exports.postActiveTimeRange = asyncHandler(async (req, res) => {
  const category = qs.parse(req.body.category);
  const todo = qs.parse(req.body.todo);
  const startDate = req.body.startDate;

  const newTime = new TimeRanges({
    category: category,
    todo: todo,
    startDate: startDate,
    isActive: true,
    endDate: null,
    userId: req.user._id,
  });

  const addedTime = await newTime.save();

  res.status(200).json(addedTime);
});

exports.postAddTimeRange = asyncHandler(async (req, res) => {
  const { rangeId, endDate } = req.body;
  const category = qs.parse(req.body.category);
  const todo = qs.parse(req.body.todo);

  const range = await TimeRanges.findById(rangeId);

  range.isActive = false;
  range.category = category;
  range.todo = todo;
  range.endDate = endDate;

  const addedRange = await range.save();

  res.status(200).json(addedRange);
});

exports.postEditTimeRange = asyncHandler(async (req, res) => {
  const { rangeId } = req.body;
  const category = qs.parse(req.body.category);
  const todo = qs.parse(req.body.todo);

  const range = await TimeRanges.findById(rangeId);

  range.category = category;
  range.todo = todo;

  const editedRange = await range.save();

  res.status(200).json(editedRange);
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
  await Promise.all(
    todos.map(async (t) => {
      t.category = null;
      await t.save();
    })
  );

  res.status(200).json(removedCategory);
});

exports.postDeleteTodo = asyncHandler(async (req, res) => {
  const { todoId, categoryId } = req.body;
  let updatedCategory;

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
    updatedCategory = await category.save();
  }

  res.status(200).json({
    todo: removedTodo,
    category: updatedCategory,
  });
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
