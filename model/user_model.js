const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose
const { TodoListSchema } = require('./todo_list_model')

const User = mongoose.model('User', new Schema({
    email: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    todo_lists: [
        TodoListSchema
    ]
}), 'todoapp_collection')

module.exports = {
    User
}