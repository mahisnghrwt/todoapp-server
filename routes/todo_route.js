const { ObjectID } = require('mongodb')
const mongoUtil = require('../mongoUtil')
let todo_items_collection = null

const init = () => {
    todo_items_collection = mongoUtil.getDb().collection("todo_items")
}

const listen = (express) => {
    findAll(express)
    find(express)
    findFor(express)
    create(express)
    update(express)
    delete_(express)
}

const findAll = (express) => {
    express.get("/api/todoItem", (req, res) => {
        todo_items_collection.find({}).toArray((err, result) => {
            res.json(result)
        })
    })
}

const find = (express) => {
    express.get("/api/todoitem/:id", (req, res) => {
        const id = req.url.split("/")[3]
        todo_items_collection.findOne({_id: new ObjectID(id)}, (err, result) => {
            res.json(result)
        })
    })
}

const findFor = (express) => {

}

const create = (express) => {
    express.post("/api/todoItem", (req, res) => {
        let query = req.body
        query = {
            ...query, completed: false, date_created: new Date()
        }

        todo_items_collection.insertOne(query, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}


const delete_ = (express) => {
    express.delete("/api/todoItem/:id", (req, res) => {
        const id = req.url.split("/")[3]
        const query = {
            _id: new ObjectID(id)
        }
        todo_items_collection.deleteOne(query, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}

const update = (express) => {
    express.put("/api/todoItem/", (req, res) => {
        //ObjectID is our query
        const query = {
            _id: new ObjectID(req.body._id)
        }
        // We need to get rid of the _id
        const {_id, ...newVal} = req.body
        console.log(newVal)
        //Updated data
        const newValues = {
            $set: newVal
        }

        todo_items_collection.updateOne(query, newValues, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}




module.exports = {
    init,
    listen
}