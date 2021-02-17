const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose
const { TodoItemSchema } = require('./todo_item_model')

const TodoListSchema = new Schema({
    title: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    todo_items: [TodoItemSchema]
})

const TodoList = mongoose.model('TodoList', TodoListSchema)
module.exports = {
    TodoList,
    TodoListSchema
}