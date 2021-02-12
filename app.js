const express = require('express')
const cors = require('cors')
const mongoUtil = require('./mongoUtil')
require('dotenv').config()
const todo_route = require('./routes/todo_route')
const todo_list_route = require('./routes/todo_list_route')

//Constants
const app = express()
let collection = null;

//Mongo stuff
async function run() {
    mongoUtil.connect()
    .then(() => {
        collection = mongoUtil.getDb().collection("todoapp_collection")
        todo_route.init()
        todo_list_route.init()
    })
}

app.use(cors())
app.use(express.json())
run()

//Routes
todo_route.listen(app)
todo_list_route.listen(app)

app.listen(process.env.PORT)