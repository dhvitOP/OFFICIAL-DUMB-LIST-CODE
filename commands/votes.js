const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("../../config.js");
const { Client, Util } = require('discord.js');
const serversdata = require("../database/models/servers/server.js");
const parseMilliseconds = require("parse-ms")
module.exports = {
  name: "vote-server",
  aliases: ["v-s", "vs", "voteserver", "vserver", "vote-s"],
 run: async(client, message, args) => {
     
    var bot = args[0];
      
    
         const votes = require("../database/models/servers/vote.js");
      let botdata = await serversdata.findOne({ serverID: args[0] });
      if(!botdata)
      {
        return message.channel.send("Not a Valid Server id");
      }
      let x = await votes.findOne({user: message.author.id,server: bot})
      if(x) {
          var timeleft = await parseMilliseconds(x.ms - (Date.now() - x.Date));
       var hour = timeleft.hours;
       var minutes = timeleft.minutes;
       var seconds = timeleft.seconds;
   
        return await message.channel.send(`You can vote again in ${hour}h ${minutes}m ${seconds}s`);
      }
      await votes.findOneAndUpdate({server: bot, user: message.author.id }, {$set: {Date: Date.now(), ms: 43200000 }}, {upsert: true})
      await serversdata.findOneAndUpdate({serverID: bot}, {$inc: {votes: 1}})
      client.channels.cache.get("849623735047946303").send(`**${message.author.username}** voted **${botdata.username}** **\`(${botdata.votes + 1} votes)\`**`)
      message.channel.send(`Done You have voted for ${bot}`)
    var votedbot = client.users.cache.get(botdata.serverID);
      if(botdata.dcwebhook)
      {
      const webhook = require("webhook-discord");
 
const Hook = new webhook.Webhook(botdata.dcwebhook);
const msg = new webhook.MessageBuilder()
.setName("Dumb Servers list Discord Webhooks")
.setAvatar("https://cdn.discordapp.com/avatars/849617280245432340/3b11b85c7054df0bcb444ed8480d3dbf.webp?size=4096")
.setTitle(`${botdata.username} Has just been Voted!!`)
.setDescription(`Voter: ${message.author.username} Bot: ${botdata.username} Total Votes: ${botdata.votes + 1}`)
.setFooter(`Discord Default Webhook`)
.setThumbnail(botdata.avatar)
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
     "bot": `${botdata.username}`,
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