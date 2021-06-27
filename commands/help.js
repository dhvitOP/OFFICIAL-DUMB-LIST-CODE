const Discord = require("discord.js");
const fs = require("fs");
const cnf = require('../../config.js');

module.exports = {
  name: "help",
  aliases: [],
 run: async(client, message, args) => {
const embed = new Discord.MessageEmbed()
.setDescription("Help of dumbbotlist.tk Official bot")
.addField("Commands list", "`eval`, `nameall`, `staff-queue`, `bots`, `botinfo`, `say`, `totalbots`, `verify`, `vote-bot`, `announce`, `decline`, `approve`, `certi give`, `certi decline`, `uptime`, `add`, `vote-server`, `totalservers`, `serverinfo`, `servers`, `bump`, `vanity-delete`, `vanities`")
message.channel.send(embed)
 }
}