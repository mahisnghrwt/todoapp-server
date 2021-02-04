const express = require('express')
const cors = require('cors')
const {MongoClient, ObjectID} = require('mongodb')

//Constants
const CONNECTION_URI = "mongodb+srv://mahi:uRmqARfRAH5pV7HG@cluster0.s3vqo.mongodb.net/todoapp_db?retryWrites=true&w=majority"
const PORT = 5001
const app = express()
let collection = null;

//Mongo stuff
async function run() {
    try {
        const client = new MongoClient(CONNECTION_URI, { useUnifiedTopology: true })
        await client.connect()
        const database = client.db("todoapp_db")
        collection = database.collection("todoapp_collection")
    } catch(error) {
        console.log(error.message)
    } finally {

    }
}

run()
app.use(cors())
app.use(express.json())

//Routes
//Get all list name
app.get("/api", (req, res) => {
    if (typeof collection !== 'undefined') {
        collection.find({}).toArray((err, result) => {
            if (err) {
                throw err
            }
            res.send(result)
        })
    }
    else {
        res.json({
            message: "Some problem occured while asking for data from MongoDB."
        })
    }
})

//Delete a list
app.delete("/api/:id", (req, res) => {
    const id = req.url.split("/")[2]
    let query = {_id: new ObjectID(id)}
    if (typeof collection !== 'undefined') {
        collection.deleteOne(query, (err, obj) => {
            if (err) {
                throw err
            }
            res.json({message: `Item with id: ${id} has been deleted!`})
        })
    }
    else {
        //collection object is undefined
        res.json({
            message: "Some problem occured while asking for data from MongoDB."
        })
    }
})

//create a new list
app.post("/api", (req, res) => {
    const query = {
        name: req.body.name
    }
    console.log(req.body)
    if (typeof collection !== 'undefined') {
        collection.insertOne(query, (err, obj) => {
            if (err) {
                throw err
            }
            res.json(obj)
        })
    }
    else {
        //collection object is undefined
        res.json({
            message: "Some problem occured while inserting data into MongoDB."
        })
    }
})

//delete multiple
app.delete("/api", (req, res) => {
    if (typeof collection !== 'undefined') {
        let query = {
            _id: {
                $in: req.body.ids.map((x) => new ObjectID(x))
            }
        }
        collection.deleteMany(query, (err, obj) => {
            if (err) {
                throw(err)
            }
        })
        res.sendStatus(200)
    }
    else {
        //collection object is undefined
        res.json({
            message: "Some problem occured while inserting data into MongoDB."
        })
    }
})

app.listen(PORT)