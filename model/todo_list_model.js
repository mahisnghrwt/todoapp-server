const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose
const { TodoItemSchema } = require('./todo_item_model')

const TodoListSchema = new Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    title: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    sort: {
        type: String,
        required: true,
        enum: ['none', 'created_at.asc', 'created_at.desc', 'priority.asc', 'priority.desc'],
        default: 'none'
    },
    todo_items: [TodoItemSchema]
})

const TodoList = mongoose.model('TodoList', TodoListSchema, 'todo_list_collection')
module.exports = {
    TodoList,
    TodoListSchema
}