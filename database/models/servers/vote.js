const mongoose = require('mongoose')
const schema = new mongoose.Schema({
user: String,
server: String,
ms: Number,
Date: Date
})
module.exports = mongoose.model('votes1', schema)