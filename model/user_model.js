const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose
const { TodoListSchema } = require('./todo_list_model')

const userSchema = new Schema({
    email: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    sort: {
        type: String,
        required: true,
        enum: ['none', 'alphabetical', 'priority', 'pending'],
        default: 'none'
    }
})

const User = mongoose.model('User', userSchema, 'todoapp_collection')

module.exports = {
    User
}