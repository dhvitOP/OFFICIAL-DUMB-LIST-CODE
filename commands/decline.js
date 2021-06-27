const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botsdata = require("../database/models/botlist/bots.js")
const config = require("../../config.js");
const db = require("quick.db");
module.exports = {
  name: "bot-decline",
  aliases: ["decline", "delete"],
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
      var bot = args[0];
     var bot = client.users.cache.get(bot)
    }
    if(!bot)
    {
      return message.channel.send("You have given an invalid bot id or mention")
    }
     if(db.has(`currentsession_${bot.id}`))
         {
           let channelid = db.fetch(`currentsession_${bot.id}`);
           if(client.channels.cache.get(channelid))
           {
           let channelto = client.channels.cache.get(channelid);
           channelto.delete()
           }
         }
  
     let botdata = await botsdata.findOne({ botID: bot.id });
       if(!botdata)
    {
      return message.channel.send("Invalid bot");
    }
     if(botdata.status === "Approved")
    {
      return message.channel.send("This bot is already Approved by someone");
    }
      var reason = args.join(" ")
    .replace(args[0], "");
    if(!reason)
    {
      return message.channel.send("Reason not given");
    }
           client.users.fetch(botdata.ownerID).then(async sahip => {
             let declineembed = new Discord.MessageEmbed()
             .setTitle("Bot Declined")
             .setDescription(`Reason: ${reason}\n Moderator: ${message.author.username}\n Bot: ${botdata.username}\n Owner: <@${botdata.ownerID}>`)
             .setFooter("Embed Logs of Administration")
               client.channels.cache.get("849623735047946303").send(declineembed)
               if(client.guilds.cache.get(config.server.id).members.fetch(botdata.ownerID))
               {
               client.users.cache.get(botdata.ownerID).send(`Your bot named **${botdata.username}** has been declined.\nReason: **${reason}**\nAuthorized: **${message.author.username}**`)
               
                  await botsdata.deleteOne({ botID: bot.id, ownerID: botdata.ownerID, botid: bot.id })
               }
           })
                let guild = client.guilds.cache.get(config.testserver);
        var bot = guild.member(botdata.botID)
        bot.kick()
         
 message.channel.send("Discord bot Declined");
}
 }
}
