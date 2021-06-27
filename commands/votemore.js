const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("../../config.js");
const { Client, Util } = require('discord.js');
const botsdata = require("../database/models/servers/server.js");
const parseMilliseconds = require("parse-ms")
module.exports = {
  name: "give-server",
  aliases: ["giveservers"],
 run: async(client, message, args) => {
   if(message.author.id === "720632216236851260")
{
    
      var bot = args[0];
    
      
    
         const votes = require("../database/models/servers/vote.js");
      let botdata = await botsdata.findOne({ serverID: bot });
      if(!botdata)
      {
        return message.channel.send("Not a valid server id");
      }
      let x = await votes.findOne({user: message.author.id,server: bot})
  
      await votes.findOneAndUpdate({server: bot, user: message.author.id }, {$set: {Date: Date.now(), ms: 43200000 }}, {upsert: true})
      await botsdata.findOneAndUpdate({serverID: bot}, {$inc: {votes: args[1]}})
     
      message.channel.send(`Done You have voted for ${bot}`)
    

 }
 }
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["v"],
  permLevel: 0
};