const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("../../config.js");
const { Client, Util } = require('discord.js');
const botsdata = require("../database/models/servers/server.js");
const parseMilliseconds = require("parse-ms");
const db = require("quick.db");
module.exports = {
  name: "bump",
  aliases: ["bumpthis", "b"],
 run: async(client, message, args) => {


        
    
         const votes = require("../database/models/servers/bump.js");
      let botdata = await botsdata.findOne({ serverID: message.guild.id });
      if(!botdata)
      {
        return message.channel.send("You have Used This Cmd in Invalid Server");
      }
      
      let x = await votes.findOne({user: message.author.id,server: message.guild.id})
      let checking = db.fetch(`bump_${message.guild.id}`)
      let checklol = await parseMilliseconds(Date.now() - checking);
      let againlol = Date.now() - checking;
       var hour = checklol.hours;
       var minutes = checklol.minutes;
       var seconds = checklol.seconds;
      if(againlol && message.author.id !== "720632216236851260") {
      return message.channel.send(`This Server Can Be Bumped In ${hour}h ${minutes}m ${seconds}s`)
      }
      if(x  && message.author.id !== "720632216236851260") {
          var timeleft = await parseMilliseconds(x.ms - (Date.now() - x.Date));
       var hour = timeleft.hours;
       var minutes = timeleft.minutes;
       var seconds = timeleft.seconds;
   
        return await message.channel.send(`You can Bump again in ${hour}h ${minutes}m ${seconds}s`);
      }
      await votes.findOneAndUpdate({server: message.guild.id, user: message.author.id }, {$set: {Date: Date.now(), ms: 43200000 }}, {upsert: true})
      message.channel.send("Done You have Bumped for This Server")
      db.set(`bump_${message.guild.id}`, Date.now());
      await botsdata.findOneAndUpdate({serverID: message.guild.id}, {$inc: {bumps: 1}})
       await botsdata.findOneAndUpdate({serverID: message.guild.id}, {$set: {bumpdata: Date.now()}})
    
  
      








 }
}
