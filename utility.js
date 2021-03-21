const { MemoryStore } = require('express-session')

const activeUsers = new Map()
const memoryStore = new MemoryStore()

module.exports = {
    activeUsers,
    memoryStore
}