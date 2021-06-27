const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("../../config.js");
const { Client, Util } = require('discord.js');
const botsdata = require("../database/models/botlist/bots.js");
const parseMilliseconds = require("parse-ms")
module.exports = {
  name: "vote-bot",
  aliases: ["vb", "v-b", "vote-bot", "v-bot", "vote-b", "v-b"],
 run: async(client, message, args) => {
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
      
    
         const votes = require("../database/models/botlist/vote.js");
      let botdata = await botsdata.findOne({ botID: bot.id });
      if(!botdata)
      {
        return message.channel.send("Not a bot");
      }
      let x = await votes.findOne({user: message.author.id,bot: bot.id})
      if(x) {
          var timeleft = await parseMilliseconds(x.ms - (Date.now() - x.Date));
       var hour = timeleft.hours;
       var minutes = timeleft.minutes;
       var seconds = timeleft.seconds;
   
        return await message.channel.send(`You can vote again in ${hour}h ${minutes}m ${seconds}s`);
      }
      await votes.findOneAndUpdate({bot: bot.id, user: message.author.id }, {$set: {Date: Date.now(), ms: 43200000 }}, {upsert: true})
      await botsdata.findOneAndUpdate({botID: bot.id}, {$inc: {votes: 1}})
      client.channels.cache.get("849623735047946303").send(`**${message.author.username}** voted **${botdata.username}** **\`(${botdata.votes + 1} votes)\`**`)
      message.channel.send(`Done You have voted for <@${bot.id}>`)
    var votedbot = client.users.cache.get(botdata.botID);
      if(botdata.dcwebhook)
      {
      const webhook = require("webhook-discord");
 
const Hook = new webhook.Webhook(botdata.dcwebhook);
const msg = new webhook.MessageBuilder()
.setName("Dumb bot list Discord Webhooks")
.setAvatar("https://cdn.discordapp.com/avatars/849617280245432340/3b11b85c7054df0bcb444ed8480d3dbf.webp?size=4096")
.setTitle(`${votedbot.username} Has just been Voted!!`)
.setDescription(`Voter: ${message.author.username} Bot: ${votedbot.username} Total Votes: ${botdata.votes + 1}`)
.setFooter(`Discord Default Webhook`)
.setThumbnail(votedbot.displayAvatarURL)
if(botdata.backURL)
Hook.send(msg);
      }
      if(botdata.webhook)
      { 
        
        const fetch = require("node-fetch");
        fetch(botdata.webhook, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
     "user": `${message.author.username}`,
     "bot": `${votedbot.username}`,
     "votes": `${botdata.votes + 1}`,
     "userid": `${message.author.id}`
     }),
  })
      }

 }
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["v"],
  permLevel: 0
};