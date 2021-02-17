const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose

const TodoItemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        required: true,
        default: false,
        type: Boolean
    },
    desc: String,
    priority: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        default: 'moderate',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const TodoItem = mongoose.model('TodoItem', TodoItemSchema)

module.exports = {
    TodoItem,
    TodoItemSchema
}