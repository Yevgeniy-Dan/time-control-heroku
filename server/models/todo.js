const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    title: {
      type: String,
      required: false,
    },
    _id: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("ToDo", todoSchema);
