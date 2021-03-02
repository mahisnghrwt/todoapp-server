const {User} = require('../model/user_model')
const {TodoList} = require("../model/todo_list_model")
const { ObjectID } = require('mongodb')

//CONSTANTS
const ENDPOINT = "/api"

const listen = (express) => {
    //response from endpoints?
    create(express)
    get(express)
    getSingle(express)
    delete_(express)
    update(express)
}

//Create a new todolist, for a user
const create = express => {
    express.post(ENDPOINT, async (req, res) => {
        if (!req.body.title) return res.sendStatus(400)

        const user = await User.findOne({
            email: req.session.user
        })
        if (!user)
            return res.status(301).json({
                message: `${req.session.user} not found!`
            })       

        const todoList = new TodoList({user_id: new ObjectID(req.session.userId), title: req.body.title})
        try {
            todoList.save()
            .then(_ => {
                res.sendStatus(200)
            })
        } catch (err) {
            if (err) throw err
        }
    })
}

//Fetch all the todo_lists for a user
const get = express => {
    express.get(ENDPOINT, async (req, res) => {
        const todoLists = await TodoList.find({user_id: new ObjectID(req.session.userId)})
        return res.json(todoLists)
    })
}

const getSingle = express => {
    express.get(ENDPOINT + "/:id", async (req, res) => {
        const id = req.url.split("/")[2]
        const todoList = await TodoList.findById(id)
        return res.json(todoList)
    })
}

//Delete a requested todo_list
const delete_ = express => {
    express.delete(ENDPOINT + "/:id", async (req, res) => {
        const id = req.url.split("/")[2]
        TodoList.deleteOne({_id: id})
        .then(_ => res.sendStatus(200))
    })
}

//Update a todo_list, 'title' is the only field that can be updated
const update = express => {
    express.put(ENDPOINT, async (req, res) => {
        if (!req.body.id || !req.body.title) {
            return res.sendStatus(500)
        }
        var todoList = await TodoList.findById(req.body.id)
        if (!todoList)
            return res.status(500).json({ message: 'todoList not found!' })
        todoList.title = req.body.title
        var updatedList
        try {
            updatedList = await todoList.save()
        } catch (err) {
            if (err) {
                res.sendStatus(500)
                throw err
            }
        }
        res.sendStatus(200)
    })
}

module.exports = {
    listen
}