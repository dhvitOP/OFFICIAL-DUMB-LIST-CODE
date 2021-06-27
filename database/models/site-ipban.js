const mongoose = require("mongoose");
let hm = new mongoose.Schema({
user: String,
sebep: String,
yetkili: String,
bannedby: String,
tagg: String
});

module.exports = mongoose.model("site-ipbans", hm);