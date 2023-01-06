const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeRangeSchema = new Schema({
  todo:
    {
      todoId: {
        type: Schema.Types.ObjectId,
        ref: "ToDo",
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    } | null,
  category:
    {
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    } | null,
  time: {
    hours: Number,
    minutes: Number,
    seconds: Number,
  },
});

module.exports = mongoose.model("TimeRange", timeRangeSchema);
