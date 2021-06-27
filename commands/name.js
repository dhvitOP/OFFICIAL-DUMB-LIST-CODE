const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/botlist/bots.js");
const config = require("../../config.js");
module.exports = {
  name: "all-name",
  aliases: ["name-all", "allbots", "ab", "nameall"],
 run: async(client, message, args) => {
     let guild1 = client.guilds.cache.get(config.server.id)
   let member1 = guild1.member(message.author.id);
   if(member1.roles.cache.has("849653061893750824"))
{
   let x = await botdata.find();
    count = 0;
   const embed = new Discord.MessageEmbed()
   .setTitle("All Bots with Owner mention and bot mention")
   x.forEach(bot => {
     embed.addField(`${count + 1}`, `Bot: <@${bot.botID}> Owner: <@${bot.ownerID}>`)
     count = count + 1;
  
   })
   await message.channel.send(embed);
 
}



 }
}