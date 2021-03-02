const {TodoItem} = require('../model/todo_item_model')
const {User} = require('../model/user_model')
const {ObjectID} = require('mongodb')
const { TodoList } = require('../model/todo_list_model')

const ENDPOINT = "/api/todo"

const listen = express => {
    get(express)
    create(express)
    delete_(express)
    update(express)
}

//create todoItem
const create = express => {
    express.post(ENDPOINT, async (req, res) => {
        if (!req.body.data || !req.body.todoListId) {
            return res.status(500).json({
                message: 'data or todoListId missing!'
            })
        }
        const todoList = await TodoList.findOne({user_id: req.session.userId, _id: req.body.todoListId})
        if (!todoList) {
            return res.status(500).json({
                message: `TodoList with id: ${req.body.todoListId} not found!`
            })
        }
        try {
            todoList.todo_items.push(new TodoItem(req.body.data))
        } catch (err) {
            if (err) {
                console.error(err)
                return res.status(500).json({
                    message: `Error occurred while validating TodoItem model!`
                })
            }
        }

        await todoList.save(err => {
            if (err) throw err
        })

        res.sendStatus(200)
    })
}

//get all items
const get = express => {
    const endpoint = "/api/:listId/:id"
    express.get(endpoint, async (req, res) => {
        const listId = req.url.split('/')[2]
        const id = req.url.split('/')[3]
        const todo = await TodoList.findById(listId).todo_items.findById(id)
        if (!todo)
            return res.status(404).json({message: `Todo: ${id} not found in TodoList: ${listId}`})
        res.json(todo)
    })

    express.get(ENDPOINT + "/:listId", async (req, res) => {
        const listId = req.url.split('/')[3]
        const todoItems = await TodoList.findById(listId).todo_items
        if (!todoItems)
            return res.status(404).json({message: `TodoList: ${listId} not found!`})
        res.json(todoItems)
    })
}

//get specific item

//delete item
const delete_ = express => {
    const endpoint = "/api/:listId/:id"
    express.delete(endpoint, async (req, res) => {
        const listId = req.url.split('/')[2]
        const id = req.url.split('/')[3]
        
        var todoList = await TodoList.findById(listId)
        todoList.todo_items.remove({_id: id})

        try {
            todoList.save(err => {
                if (err) throw err
            })
        } catch (err) {
            res.status(500).json({message: "Error occured while saving changes!"})
            if (err) throw err
        }

        res.sendStatus(200)
    })
}

//update item
const update = express => {
    express.put(ENDPOINT, async (req, res) => {
        if (!req.body.data || !req.body.todoListId || !req.body.todoId) {
            return res.status(500).json({
                message: 'todoListId, todoId and data attributes are required!'
            })
        }
        
        var todoList = await TodoList.findById(todoListId)
        const itemIndex = todoList.todo_items.findIndex(x => x._id == req.body.todoId)
        todoList.todo_items[itemIndex] = {
            ...todoList.todo_items[itemIndex],
            ...req.body.data
        }

        todoList.save(err => {
            if (err) throw err
        })

        res.sendStatus(200)
    })
}

module.exports = {
    listen
}