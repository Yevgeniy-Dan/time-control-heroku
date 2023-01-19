const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeRangeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
    ms: {
      type: Number,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
  },
});

module.exports = mongoose.model("TimeRange", timeRangeSchema);
