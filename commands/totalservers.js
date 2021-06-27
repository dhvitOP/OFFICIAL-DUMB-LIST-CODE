const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/servers/server.js")
const config = require("../../config.js");
module.exports = {
  name: "total-servers",
  aliases: ["t-s", "ts", "totalservers"],
 run: async(client, message, args) => {
   
   let x = await botdata.find();
   message.channel.send(`Dumb Servers list have total ${x.length} servers currently`);




 }
}