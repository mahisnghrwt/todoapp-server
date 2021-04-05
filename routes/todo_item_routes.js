const {TodoItem} = require('../model/todo_item_model')
const {TodoList} = require('../model/todo_list_model')

const ENDPOINT = "/api/todo"
const GET_ENDPOINT = ENDPOINT + "/:listId" 
const GET_SINGLE_ENDPOINT = ENDPOINT + '/api/:listId/:id'
const DELETE_ENDPOINT = ENDPOINT + '/delete'

const listen = express => {
    get(express)
    create(express)
    delete_(express)
    update(express)
}

//create todoItem
const create = express => {
    express.post(ENDPOINT, async (req, res) => {
        if (!req.body.todo || !req.body.todoListId) {
            return res.sendStatus(400)
        }
        const todoList = await TodoList.findOne({user_id: req.session.userId, _id: req.body.todoListId})
        if (!todoList) {
            return res.status(500).json({
                message: `TodoList with id: ${req.body.todoListId} not found!`
            })
        }

        const newTodo = new TodoItem({...req.body.todo})
        todoList.todo_items.push(newTodo)
        todoList.save(err => {
            if (err) throw err
        })

        res.json(newTodo)
    })
}

//get all items
const get = express => {
    express.get(GET_SINGLE_ENDPOINT, async (req, res) => {
        const listId = req.url.split('/')[2]
        const id = req.url.split('/')[3]
        const todo = await TodoList.findById(listId).todo_items.findById(id)
        if (!todo)
            return res.status(404).json({message: `Todo: ${id} not found in TodoList: ${listId}`})
        res.json(todo)
    })

    express.get(GET_ENDPOINT, async (req, res) => {
        const listId = req.url.split('/')[3]
        const todoItems = await TodoList.findById(listId).todo_items
        if (!todoItems)
            return res.status(404).json({message: `TodoList: ${listId} not found!`})
        res.json(todoItems)
    })
}


//delete item
const delete_ = express => {
    express.post(DELETE_ENDPOINT, async (req, res) => {
        const listId = req.body.todoListId
        const id = req.body.todoId
        if (!listId || !id) {
            return res.sendStatus(400)
        }

        var todoList = await TodoList.findById(listId)
        todoList.todo_items.remove({_id: id})
        todoList.save(err => {
            if (err) {
                res.sendStatus(500)
                return console.error(err)
            }
        })

        res.sendStatus(200)
    })
}

//update item
const update = express => {
    express.put(ENDPOINT, async (req, res) => {
        console.log(req.body)
        if (!req.body.todo || !req.body.todoListId)
            return res.sendStatus(400)
        var todoIndex = -1
        const todoList = await TodoList.findOne({user_id: req.session.userId, _id: req.body.todoListId})
        if (todoList)
            todoIndex = todoList.todo_items.findIndex(x => x._id == req.body.todo._id)
        if (todoIndex == -1) return res.sendStatus(500)

        todoList.todo_items[todoIndex] = req.body.todo
        const updatedTodo = todoList.todo_items[todoIndex]
        todoList.save(err => {
            if (err) throw err
        })
        res.json(updatedTodo)
    })
}

module.exports = {
    listen
}