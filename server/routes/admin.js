const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/categories => GET
router.get("/categories", adminController.getCategories);

// /admin/add-todo => GET
router.get("/todos", adminController.getTodos);

// /admin/edit-category => POST
router.post("/edit-category", adminController.postEditCategory);

// /admin/add-category => POST
router.post("/add-category", adminController.postAddCategory);

// /admin/add-todo => POST
router.post("/add-todo", adminController.postAddTodo);

// /admin/delete-category => POST
router.post("/delete-category", adminController.postDeleteCategory);

// /admin/delete-category => POST
router.post("/delete-todo", adminController.postDeleteTodo);

module.exports = router;
