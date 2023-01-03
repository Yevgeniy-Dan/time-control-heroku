const Category = require("../models/category");

exports.getCategories = (req, res, next) => {
  Category.find().then((categories) => {
    res.json({
      categories: categories,
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

exports.postDeleteCategory = (req, res, next) => {
  const categoryId = req.body.categoryId;
  Category.findByIdAndRemove(categoryId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};
