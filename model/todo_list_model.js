const mongoose = require('../mongooseUtil').getConnection()
const {Schema} = mongoose
const {TodoItem, TodoItemSchema} = require('./todo_item_model')

const TodoListSchema = new Schema({
    title: String,
    created_at: Date,
    todo_items: [TodoItemSchema]
})

const TodoList = mongoose.model('TodoList', TodoListSchema)

module.exports = {
    TodoList,
    TodoListSchema
}