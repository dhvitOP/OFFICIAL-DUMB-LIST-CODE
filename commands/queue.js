const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/botlist/bots.js")
const config = require("../../config.js");
module.exports = {
  name: "staff-queue",
  aliases: ["queue-staff"],
 run: async(client, message, args) => {
    let guild1 = client.guilds.cache.get(config.server.id)
   let member1 = guild1.member(message.author.id);
   if(member1.roles.cache.has("849653061893750824") || member1.roles.cache.has("849653292769869855"))
{
   let x = await botdata.find();
   const embed = new Discord.MessageEmbed()
   .setTitle("Dumb Bot list Queue")
 let test = x.filter(a => a.status === "UnApproved");
 if(!test[0])
 {
   return message.channel.send("**Your Job is Done!!**");
 }

 test.map(b => {
   if(!b)
   {
      return embed.setDescription("**Your Job is done!!!**")
   }
    embed.addField(`${b.username}`, `[Invite:](https://discord.com/api/oauth2/authorize?client_id=${b.botID}&permissions=0&scope=bot)`)
  })

  await message.channel.send(embed)
   
 
}



 }
}