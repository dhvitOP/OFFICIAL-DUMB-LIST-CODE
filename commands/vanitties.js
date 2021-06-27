const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/vanity/vanity.js")
module.exports = {
  name: "vanities",
  aliases: [],
 run: async(client, message, args) => {
   let x = await botdata.find();
   var bots = await x.filter(a => a.ownerID == message.author.id)
    var botstoshow = bots.map(a => `Name: ${a.username} | Type: ${a.type || "Server"} | Link: https://dumbbotlist.tk/${a.username}`).join("\n");
 if(!botstoshow)
 {
   var botstoshow = "No Vanities";
 }
   const embed = new Discord.MessageEmbed()
   .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
   .setDescription(`**Total ${bots.length} Vanities found.**`)
   .setColor("#7289da")
   .addField("Servers", `${botstoshow}`, true)
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