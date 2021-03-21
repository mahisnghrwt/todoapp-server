const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose

const userSchema = new Schema({
    email: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    sort: {
        type: String,
        required: true,
        enum: ['none', 'title.asc', 'title.desc', 'highPriorityCount.asc', 'highPriorityCount.desc', 'pendingCount.asc', 'pendingCount.desc', 'created_at.asc', 'created_at.desc'],
        default: 'none'
    }
})

const User = mongoose.model('User', userSchema, 'todoapp_collection')

module.exports = {
    User
}