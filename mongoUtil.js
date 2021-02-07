const {MongoClient} = require('mongodb')
require('dotenv').config()

let db = null

const connect = async () => {
    try {
        const client = new MongoClient(process.env.CONNECTION_URI, { useUnifiedTopology: true })
        await client.connect()
        db = client.db("todoapp_db")
    } catch(error) {
        console.log(error.message)
    }
}

const getDb = () => {
    return db
}

module.exports = {
    connect,
    getDb
}