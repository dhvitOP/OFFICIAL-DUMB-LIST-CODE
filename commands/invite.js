const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("../../config.js");
const { Client, Util } = require('discord.js');
module.exports = {
  name: "invite",
  aliases: [],
 run: async(client, message, args) => {
message.channel.send("Invite me With This Link - https://discord.com/oauth2/authorize?client_id=849617280245432340&permissions=93185&scope=bot")

 }
}