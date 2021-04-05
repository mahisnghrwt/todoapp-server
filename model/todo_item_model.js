const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose
const {TodoActivitySchema} = require('./todo_activity_model')

const TodoItemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    compeleted: {
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
    },
    type: {
        type: String,
        enum: ['regular', 'recurring'],
        default: 'regular',
        required: true
    },
    recurring_activity: [TodoActivitySchema]
})

const TodoItem = mongoose.model('TodoItem', TodoItemSchema)

module.exports = {
    TodoItem,
    TodoItemSchema
}