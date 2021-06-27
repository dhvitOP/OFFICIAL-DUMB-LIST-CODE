const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/botlist/bots.js")
module.exports = {
  name: "bots",
  aliases: [],
 run: async(client, message, args) => {
   let x = await botdata.find();
   var bots = await x.filter(a => a.ownerID == message.author.id || a.coowners.includes(message.author.id))
 var botstoshow = bots.map(a => "<@"+a.botID+">").join("\n");
 if(!botstoshow)
 {
   var botstoshow = "no bots";
 }
   const embed = new Discord.MessageEmbed()
   .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
   .setDescription(`**Total ${bots.length} bots found.**`)
   .setColor("#7289da")
   .addField("Bots", `${botstoshow}`, true)
   message.channel.send(embed)
}
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
  };
  
  exports.help = {
    name: "bots",
    description: "",
    usage: ""
  };