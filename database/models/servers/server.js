const mongoose = require("mongoose");
let hm = new mongoose.Schema({
ownerID: String,
serverID: String,
serverid:String,
username: String,
discrim: String,
bumpdata: {type: Date, default: 0},
date: String,
avatar: String,
invitelink: String,
longDesc: String,
shortDesc: String,
tags: Array,
vanity: String,
bumps: {type: Number, default: 0},
coowners: Array,
today: String,
webhook: String,
dcwebhook: String,
status: String,
users: String,
website: String,
backURL: String,
nsfw: String,
premium: String,
Date: {type: Date, default: null},
certificate: String,
votes: {type: Number, default: 0},
tocheck: String
});

module.exports = mongoose.model("servers", hm);
