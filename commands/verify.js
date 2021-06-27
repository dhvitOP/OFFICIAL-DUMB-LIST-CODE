const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botsdata = require("../database/models/botlist/bots.js")
const config = require("../../config.js");
const db = require("quick.db");
module.exports = {
  name: "bot-verify",
  aliases: ["verify"],
 run: async(client, message, args) => {
   let guild1 = client.guilds.cache.get(config.server.id)
   let member1 = guild1.member(message.author.id);
   if(member1.roles.cache.has("849653061893750824") || member1.roles.cache.has("849653292769869855"))
{

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
     const botdata = await botsdata.findOne({ botID: bot.id })
     if(!botdata)
     {
       return message.channel.send("Invalid Bot");
     }
     if(botdata.status == "Approved")
     {
       return message.channel.send("The bot is already approved you cannot start a verification session again");
     }
     if(db.has(`currentsession_${bot.id}`))
     {
       return message.channel.send("Another Web moderator have already started a bot session of this bot");
     }
message.guild.channels.create(`verify-session-${message.author.id}-${bot.id}`, {
			permissionOverwrites: [
				{
					id: message.author.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
				},
				{
					id: message.guild.roles.everyone,
					deny: ['VIEW_CHANNEL'],
				},
        {
          id: bot.id,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS']
        }
			],
			type: 'text',
		}).then(async channel => {
      db.set(`currentsession_${bot.id}`, channel.id);
			message.reply(`Discord bot verification session Started check <#${channel.id}>!`);
			channel.send(`Hi ${message.author}, welcome to your Verification Session! The ${bot.username} Prefix is ${botdata.prefix}, You can test the bot here.`);
		});
}
}
 }