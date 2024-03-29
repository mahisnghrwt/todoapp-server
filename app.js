const express = require('express')
const cors = require('cors')
const session = require("express-session")
const {memoryStore} = require('./utility')
require('dotenv').config()

//routes
const todo_list_route = require('./routes/todo_list_routes')
const user_route = require('./routes/user_routes')
const todo_item_route = require('./routes/todo_item_routes')

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(session({
    store: memoryStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 3600000
    }
}))

const authenticate = (req, res, next) => {
    if (req.session.user || req.url === "/api/auth/google") {
        next()
    }
    else {
        console.log(`~ Tried to contact ${req.url}, replied with 401.`)
        res.sendStatus(401)
    }
}

app.use(authenticate)

//hook express with the routes
user_route.listen(app)
todo_list_route.listen(app)
todo_item_route.listen(app)

app.listen(process.env.PORT)