const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/categories => GET
router.get("/categories", adminController.getCategories);

// /admin/add-category => POST
router.post("/add-category", adminController.postAddCategory);

// /admin/delete-category => POST
router.post("/delete-category", adminController.postDeleteCategory);

module.exports = router;
