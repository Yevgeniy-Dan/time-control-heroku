const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  todoCart: {
    items: [
      {
        todoId: {
          type: Schema.Types.ObjectId,
          ref: "ToDo",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToTodoCart = function (todo) {
  const updatedTodoItems = [...this.todoCart.items];

  updatedTodoItems.push({
    todoId: todo._id,
  });

  const updatedTodoCart = {
    items: updatedTodoItems,
  };

  this.todoCart = updatedTodoCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
