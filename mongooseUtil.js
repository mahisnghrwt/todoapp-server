const mongoose = require('mongoose')
require('dotenv').config()

const init = () => {
    mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = mongoose.connection
    db.once('open', () => {
        console.log(`Connected to database!`)
    })

    db.on('error', err => {
        console.error('Connection error: ', err)
    })
}

const getConnection = () => {
    if (mongoose.connection.readyState === 0) {
        init()
    }
    return mongoose
}

module.exports = {
    getConnection
}