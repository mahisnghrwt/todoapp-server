const {User} = require('../model/user_model')
const {TodoList} = require("../model/todo_list_model")
const { ObjectID } = require('mongodb')

//CONSTANTS
const ENDPOINT = "/api"

const listen = (express) => {
    create(express)
    get(express)
    delete_(express)
    update(express)
}

//Create a new todolist, for a user
const create = express => {
    express.post(ENDPOINT, async (req, res) => {
        if (!req.body.title)
            return res.sendStatus(400)

        const user = await User.findOne({
            email: req.session.user
        })
        if (!user)
            return res.sendStatus(301)
        user.todo_lists.push(new TodoList({title: req.body.title}))
        user.save((err) => {
            if (err) {
                res.sendStatus(500)
                console.error(err)
                return
            }
        })
        res.json(user.todo_lists)
    })
}

//Fetch all the todo_lists for a user
const get = express => {
    express.get(ENDPOINT, async (req, res) => {
        const user = await User.findOne({
            email: req.session.user
        })
        if (!user)
            return res.sendStatus(301)
        return res.json(user.todo_lists)
    })
}

//Delete a requested todo_list
const delete_ = express => {
    express.delete(ENDPOINT, async (req, res) => {
        if (!req.body._id) 
            return res.sendStatus(500)
        const user = await User.findOne({
            email: req.session.user
        })

        if (!user)
            return res.sendStatus(301)

        if (!user.todo_lists.id(new ObjectID(req.body._id))) {
            return res.status(500).json({
                message: 'List not found!'
            })
        }
        user.todo_lists.id(new ObjectID(req.body._id)).remove()
        user.save((err) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
        })
        res.json(user.todo_lists)
    })
}

//Update a todo_list, 'title' is the only field that can be updated
const update = express => {
    express.put(ENDPOINT, async (req, res) => {
        if (!req.body._id || !req.body.title) {
            return res.sendStatus(500)
        }
        let user = await User.findOne({
            email: req.session.user
        })
        if (!user) 
            return res.sendStatus(301)
        if (!user.todo_lists.id(new ObjectID(req.body._id))) {
            return res.status(500).json({
                message: 'List _id not found!'
            })
        }
        const index = user.todo_lists.findIndex(x => x._id == req.body._id)
        if (index === -1)
            return res.status(500).json({ message: 'todo_list not found!' })
        user.todo_lists[index].title = req.body.title
        user.save((err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'Model validation error.' })
            }
        })

        res.json(user.todo_lists)
    })
}

module.exports = {
    listen
}