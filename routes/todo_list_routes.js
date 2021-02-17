const {User} = require('../model/user_model')
const {TodoList} = require("../model/todo_list_model")
const { ObjectID } = require('mongodb')

//CONSTANTS
const ENDPOINT = "/api"

const listen = (express) => {
    _create(express)
    _get(express)
    _delete(express)
    _update(express)
}

//Create a new todolist, for a user
const _create = express => {
    express.post(ENDPOINT, async (req, res) => {
        if (!req.body.title)
            return res.sendStatus(400)

        const user = await User.findOne({
            email: req.session.user
        })
        //this should not be possible
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

const _get = express => {
    express.get(ENDPOINT, async (req, res) => {
        const user = await User.findOne({
            email: req.session.user
        })
        if (!user)
            return res.sendStatus(301)
        return res.json(user.todo_lists)
    })
}

const _delete = express => {
    express.delete(ENDPOINT, async (req, res) => {
        if (!req.body._id) 
            return res.sendStatus(500)
        const user = await User.findOne({
            email: req.session.user
        })

        if (!user)
            return res.sendStatus(301)

        if (!user.todo_lists.id(new ObjectID(req.body._id))) {
            res.status(500)
            res.json({
                message: 'List not found!'
            })
            return
        }
        user.todo_lists.id(new ObjectID(req.body._id)).remove()
        user.save((err) => {
            if (err) {
                res.sendStatus(500)
                return console.error(err)
            }
        })
        res.json(user.todo_lists)
    })
}

const _update = express => {
    express.put(ENDPOINT, async (req, res) => {
        if (!req.body._id || !req.body.title) {
            return res.sendStatus(500)
        }
        let user = await User.findOne({
            email: req.session.user
        })
        if (!user) {
            return res.sendStatus(301)
        }
        if (!user.todo_lists || !user.todo_lists.id(new ObjectID(req.body._id))) {
            res.status(500)
            res.json({
                message: 'List _id not found!'
            })
            return
        }
        const index = user.todo_lists.findIndex(x => x._id == req.body._id)
        user.todo_lists[index].title = req.body.title
        user.save((err) => {
            if (err) {
                return console.error(err.errors)
            }
        })
        res.json(user.todo_lists)
    })
}

module.exports = {
    listen
}