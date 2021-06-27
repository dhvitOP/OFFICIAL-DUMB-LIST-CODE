const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/botlist/bots.js")
const config = require("../../config.js");
module.exports = {
  name: "total-bots",
  aliases: ["t-b", "tb", "totalbots"],
 run: async(client, message, args) => {
   
   let x = await botdata.find();
   message.channel.send(`Dumb bot list have total ${x.length} bots currently`);




 }
}