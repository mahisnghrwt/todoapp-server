const mongoose = require('../mongooseUtil').getConnection()
const { Schema } = mongoose

const TodoActivitySchema = new Schema({
    activity: {
        type: String,
        enum: ['RIGHT', 'WRONG', 'CRY', 'LATE', 'QUESTION'],
        default: 'RIGHT'
    },
    msg: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const TodoActivity = mongoose.model('TodoActivity', TodoActivitySchema)

module.exports = {
    TodoActivity,
    TodoActivitySchema
}