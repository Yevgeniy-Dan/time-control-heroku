const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

const { protect } = require("../middleware/auth");

/* --------------  Category  --------------*/
router.get("/categories", protect, adminController.getCategories);

router.post("/add-category", protect, adminController.postAddCategory);

router.post("/delete-category", protect, adminController.postDeleteCategory);

router.post("/edit-category", protect, adminController.postEditCategory);

/* --------------  ToDo  --------------*/
router.get("/todos", protect, adminController.getTodos);

router.post("/add-todo", protect, adminController.postAddTodo);

router.post("/delete-todo", protect, adminController.postDeleteTodo);
/* --------------  Time Ranges  --------------*/

router.get("/time-ranges", protect, adminController.getTimeRanges);

router.post("/add-time", protect, adminController.postAddTimeRange);

router.post("/delete-time-range", protect, adminController.postDeleteTimeRange);

module.exports = router;
