const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botsdata = require("../database/models/botlist/bots.js")
const config = require("../../config.js");
const db = require("quick.db");
module.exports = {
  name: "certificate",
  aliases: ["certi"],
 run: async(client, message, args) => {
    let guild1 = client.guilds.cache.get(config.server.id)
   let member1 = guild1.member(message.author.id);
   if(member1.roles.cache.has("849653061893750824") || member1.roles.cache.has("849653292769869855"))
{
 var certirole = config.roles.botlist.certified_bot;
    var botrole = config.roles.botlist.bot;
   var devrole = config.roles.botlist.developer;
    var certidevrole = config.roles.botlist.certified_developer
      
    var bot = message.mentions.users.first()
    if(bot)
    {
      var bot = bot;
    } else {
      var bot = args[1];
     var bot = client.users.cache.get(bot)
    }
    if(!bot)
    {
      return message.channel.send("You have given an invalid bot id or mention")
    }
    if(args[0] === "give" || args[0] === "approve")
    {
    const botdata = await botsdata.findOne({ botID: bot.id })
    if(!botdata)
    {
      return message.channel.send("Invalid bot");
    }
    if(botdata.certificate === "Certified")
    {
      return message.channel.send("This bot is already certified by someone");
    }
await botsdata.findOneAndUpdate({botID: bot.id},{$set: {
              certificate: "Certified",
              Date: Date.now(),
          }
         })
         if(db.has(`currentsession_${bot.id}`))
         {
           
           let channelid = db.fetch(`currentsession_${bot.id}`);
           if(client.channels.cache.get(channelid))
           {

           
           let channelto = client.channels.cache.get(channelid);
           channelto.delete()
           }
         }
          client.users.fetch(bot.id).then(bota => {
           let approveembed = new Discord.MessageEmbed()
             .setTitle("Bot Certified")
             .setDescription(`Moderator: ${message.author.username}\n Bot: ${bota.username}\n Owner: <@${botdata.ownerID}>`)
             .setFooter("Embed Logs of Administration")
              client.channels.cache.get(config.channels.botlog).send(approveembed)
              if(client.users.cache.get(botdata.ownerID))
              {
              client.users.cache.get(botdata.ownerID).send(`Your bot named **${bota.tag}** has been Certified.`)
              }
          })
             let guild = client.guilds.cache.get(config.server.id);
         if(guild.member(botdata.botID))
         {
         let bot = guild.member(botdata.botID);
        bot.roles.add(certirole)
         }
         if(guild.member(botdata.ownerID))
         {
         let owner = guild.member(botdata.ownerID);
         owner.roles.add(certidevrole);
         }
         if(parseInt(botdata.coowners)) {
         
             botdata.coowners.map(a => {
              
               if(guild.members.fetch(a))
               {
                 
              let coowner = guild.member(a);
              coowner.roles.add(certidevrole);
               }
             })
         }
          message.channel.send("Discord bot Certified");


    } 
    if(args[0] === "decline" || args[0] === "deny")
    {
    const botdata = await botsdata.findOne({ botID: bot.id })
    if(!botdata)
    {
      return message.channel.send("Invalid bot");
    }
    if(botdata.certificate === "Certified")
    {
      return message.channel.send("This bot is already certified by someone");
    }
await botsdata.findOneAndUpdate({botID: bot.id},{$set: {
              certificate: "Certified",
              Date: Date.now(),
          }
         })
         if(db.has(`currentsession_${bot.id}`))
         {
           
           let channelid = db.fetch(`currentsession_${bot.id}`);
           if(client.channels.cache.get(channelid))
           {

           
           let channelto = client.channels.cache.get(channelid);
           channelto.delete()
           }
         }
          client.users.fetch(bot.id).then(bota => {
           let approveembed = new Discord.MessageEmbed()
             .setTitle("Bot Declined Certified")
             .setDescription(`Moderator: ${message.author.username}\n Bot: ${bota.username}\n Owner: <@${botdata.ownerID}>`)
             .setFooter("Embed Logs of Administration")
              client.channels.cache.get(config.channels.botlog).send(approveembed)
              if(client.users.cache.get(botdata.ownerID))
              {
              client.users.cache.get(botdata.ownerID).send(`Your bot named **${bota.tag}** has been Certified.`)
              }
          })
         
          message.channel.send("Discord bot Declined from Certified");
    }

}
 }
}