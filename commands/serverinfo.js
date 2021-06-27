const Discord = require('discord.js');
const client = new Discord.Client();
const bots = require("../database/models/servers/server.js");
const db = require("quick.db");
module.exports = {
  name: "serverinfo",
  aliases: ["server-info"],
 run: async(client, message, args) => {
  
  
      var bot = args[0];
     var bot = client.users.cache.get(bot)
    
    if(!bot)
    {
      return message.channel.send("You have given an invalid server id")
    }
    
    

   let b = await bots.findOne({ serverID: bot });
   if(!b) return message.channel.send("Invalid server id.")
   let website = b.website ?  " | [Website]("+b.website+")" : "";
 
   
   
  
   const embed = new Discord.MessageEmbed()
   .setThumbnail(b.avatar)
   .setAuthor(b.username, b.avatar)
   .setDescription(`**[Vote for the Server named "${b.username} in Dumb Servers List.](https://dumbbotlist.tk/servers/${b.serverID}/vote)**`)
   .addField("ID", b.serverID, true)
   .addField("Username", b.username, true)
   .addField("Discriminator", b.discrim, true)
   .addField("Votes", b.votes, true)
   .addField("Certificate", b.certificate, true)
   .addField("Short Description", b.shortDesc, true)
   .setColor("#7289da")
   .addField("Owner(s)", `<@${b.ownerID}>`, true)
   .addField("Links", `[Invite](${b.invitelink})`, true)
   message.channel.send(embed)
}
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
  };
  
  exports.help = {
    name: "bot-info",
    description: "",
    usage: ""
  };