const mongoUtil = require('../mongoUtil')
const {ObjectID} = require('mongodb')
let collection = null
const COLLECTION = "todoapp_collection"
const ENDPOINT = "/api"

const init = () => {
    collection = mongoUtil.getDb().collection(COLLECTION)
}

const listen = (express) => {
    findAll(express)
    findFor(express)
    delete_(express)
    create(express)
    update(express)
}

//findAll
//GET req
const findAll = express => {
    express.get(ENDPOINT, (req, res) => {
        if (collection == null) {
            console.log(`collection null in findAll route.`)
            res.json({message: "something went wrong!"})
        }

        collection.find({}).toArray((err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}

//findFor
//get req
const findFor = express => {
    express.get(ENDPOINT + "/:id", (req, res) => {
        if (collection == null) {
            console.log(`collection null in findAll route.`)
            res.json({message: "something went wrong!"})
        }

        const id = req.url.split("/")[2]
        const query = {
            _id: new ObjectID(id)
        }
        collection.find(query).toArray((err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}

//create
//post req
const create = express => {
    express.post(ENDPOINT, (req, res) => {
        if (collection == null) {
            console.log(`collection null in findAll route.`)
            res.json({message: "something went wrong!"})
        }

        const query = req.body

        collection.createOne(query, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}

//delete
//delete req
const delete_ = express => {
    express.delete(ENDPOINT + "/:id", (req, res) => {
        if (collection == null) {
            console.log(`collection null in findAll route.`)
            res.json({message: "something went wrong!"})
        }

        const id = req.url.split("/")[2]
        const query = {
            _id: new ObjectID(id)
        }

        collection.deleteOne(query, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}

//update
//put req
const update = express => {
    express.put(ENDPOINT, (req, res) => {
        if (collection == null) {
            console.log(`collection null in findAll route.`)
            res.json({message: "something went wrong!"})
        }

        const {_id, ...newVals} = req.body
        const query = {
            _id: new ObjectID(_id)
        }

        collection.updateOne(query, newVals, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
}

module.exports = {
    init,
    listen
}