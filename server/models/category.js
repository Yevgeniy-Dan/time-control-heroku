const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  todos: [
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
    },
  ],
  color: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

categorySchema.methods.addTodoItem = function (todo) {
  const updatedTodoItems = [...this.todos];

  updatedTodoItems.push({
    todoId: todo._id,
    title: todo.title,
  });

  this.todos = updatedTodoItems;
  return this.save();
};

categorySchema.methods.removeTodoItem = function (todoId) {
  const updatedTodoItems = this.todos.filter((todo) => {
    return todo.todoId.toString() !== todoId.toString();
  });
  this.todos = updatedTodoItems;
  return this.save();
};

module.exports = mongoose.model("Category", categorySchema);
