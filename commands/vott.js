const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("../../config.js");
const { Client, Util } = require('discord.js');
const botsdata = require("../database/models/botlist/bots.js");
const parseMilliseconds = require("parse-ms")
module.exports = {
  name: "give-votes",
  aliases: ["give"],
 run: async(client, message, args) => {
   if(message.author.id === "720632216236851260")
{
    
      var bot = args[0];
     
      
    
         const votes = require("../database/models/botlist/vote.js");
      let botdata = await botsdata.findOne({ botID: bot });
      if(!botdata)
      {
        return message.channel.send("Not a valid bot id");
      }
      let x = await votes.findOne({user: message.author.id,server: bot})
  
      await votes.findOneAndUpdate({bot: bot, user: message.author.id }, {$set: {Date: Date.now(), ms: 43200000 }}, {upsert: true})
      await botsdata.findOneAndUpdate({botID: bot}, {$inc: {votes: args[1]}})
     
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