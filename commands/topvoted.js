const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/botlist/bots.js")
const config = require("../../config.js");
module.exports = {
  name: "top-voted-bots",
  aliases: ["tvb", "top-v-b", "topvotedbots"],
 run: async(client, message, args) => {
const botsdata = await botdata.find();
var botsdata1 = botsdata.sort((a, b) => b.votes - a.votes).slice(0, 6).map(a => `<@${a.botID}> With ${a.votes} Votes, Bot Made By <@${a.ownerID}>`).join("\n");

 if(!botsdata1)
 {
   var botsdata1 = "no bots";
 }
    const embed = new Discord.MessageEmbed()
   .setTitle("Top Voted Bots In A Week")
   .setDescription(`**Total 6 bots found and Here are Winners.**`)
   .setColor("#7289da")
   .addField("Bots", `${botsdata1}`, true)
   message.channel.send(embed)
 }
}