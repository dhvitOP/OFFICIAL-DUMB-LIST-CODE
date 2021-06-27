const mongoose = require("mongoose");
let hm = new mongoose.Schema({
userID: String,
ipv4: {type: String, default: null},
username: {type: String, default: null},
tag: {type: String, default: null},
time: {type: String, default: null},
});

module.exports = mongoose.model("ip-adress", hm);