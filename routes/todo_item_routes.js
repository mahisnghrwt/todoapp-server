const {TodoItem} = require('../model/todo_item_model')
const {User} = require('../model/user_model')
const {ObjectID} = require('mongodb')

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
        if (!req.body.data || !req.body.todo_list_id) {
            return res.status(500).json({
                message: 'todo_list_id or -data- object missing!'
            })
        }
        const user = await User.findOne({email: req.session.user})
        if (!user) {
            return res.status(401).json({
                message: `User with email ${req.session.user} not found!`
            })
        }

        if (!user.todo_lists) {
            return res.status(500).json({
                message: `No todo_list found!`
            })
        }
        const index = user.todo_lists.findIndex(x => x._id == req.body.todo_list_id)
        if (index == -1) {
            return res.status(500).json({
                message: `todo_list with id: ${req.body.todo_list_id} not found!`
            })
        }

        try {
            user.todo_lists[index].todo_items.push(new TodoItem(req.body.data))
        } catch (err) {
            if (err) {
                console.error(err)
                return res.status(500).json({
                    message: `Error occurred while validating TodoItem model!`
                })
            }
        }

        user.save((err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({
                    "message": "Model validation error!"
                })
            }
        })

        res.json(user.todo_lists)
    })
}

//get all items
const get = express => {
    express.get(ENDPOINT, async (req, res) => {
        if (!req.body.todo_list_id) {
            return res.status(500).json({
                message: 'todo_list_id not found!'
            })
        }

        const user = await User.findOne({
            email: req.session.user
        })

        if (!user) {
            return res.status(500).json({
                message: 'User not found!'
            })
        }

        let index = -1;
        if (user.todo_lists) {
            index = user.todo_lists.findIndex(x => x._id == req.body.todo_list_id)
        }

        if (index == -1) {
            return res.status(500).json({
                message: 'todo_list not found!'
            })
        }

        res.json(user.todo_lists)
    })
}

//get specific item

//delete item
const delete_ = express => {
    express.delete(ENDPOINT, async (req, res) => {
        if (!req.body.todo_list_id || !req.body.todo_id)
            return res.status(500).json({message: "todo_list_id and todo_id required!"})
        
        const user = await User.findOne({
            email: req.session.user
        })

        //If the user doesnt exist
        if (!user) {
            return res.status(500).json({
                message: 'User not found!'
            })
        }

        try {
            user.todo_lists.id(new ObjectID(req.body.todo_list_id)).todo_items.id(new ObjectID(req.body.todo_id)).remove()
        } catch (err) {
            return res.sendStatus(500)
        }
        user.save(err => {
            if (err) {
                return res.status(500).json({message: "Error occured while saving the changes inside the database!"})
            }
        })

        res.json(user.todo_lists)
    })
}

//update item
const update = express => {
    express.put(ENDPOINT, async (req, res) => {
        if (!req.body.data || !req.body.todo_list_id || !req.body.todo_id) {
            return res.status(500).json({
                message: 'todo_list_id, todo_id and data required!'
            })
        }
        const user = await User.findOne({email: req.session.user})
        if (!user) {
            return res.status(401).json({
                message: `User with email ${req.session.user} not found!`
            })
        }

        if (!user.todo_lists) {
            return res.status(500).json({
                message: `No todo_list found!`
            })
        }

        let listIndex = -1, itemIndex = -1
        listIndex = user.todo_lists.findIndex((x) => x._id == req.body.todo_list_id)
        if (listIndex != -1)
            itemIndex = user.todo_lists[listIndex].todo_items.findIndex(x => x._id == req.body.todo_id)

        try {
            user.todo_lists[listIndex].todo_items[itemIndex] = {
                ...user.todo_lists[listIndex].todo_items[itemIndex],
                ...req.body.data
            }
        } catch (err) {
            if (err) {
                console.error(err)
                return res.status(500).json({
                    message: `Error occurred while validating TodoItem model!`
                })
            }
        }

        user.save((err) => {
            if (err) {
                console.log(err)
                res.status(200).json({
                    "message": "Validation error!"
                })
            }
        })

        res.json(user.todo_lists)
    })
}

module.exports = {
    listen
}