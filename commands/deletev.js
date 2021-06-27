const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const botdata = require("../database/models/vanity/vanity.js")
module.exports = {
  name: "vanity-delete",
  aliases: [],
 run: async(client, message, args) => {
   let x = await botdata.find();
   if(!args[0])
   {
     return message.channel.send("Give ma a Vanity Name to delete");
   }
   let test = await botdata.findOne({ username: args[0]});
 if(test.ownerID == message.author.id)
 {

 
 await botdata.deleteOne({ username: args[0] })
   
   message.channel.send(`Done Your ${test.type || "N/A"} Vanity is Deleted`)
 } else {
      return message.channel.send("You must be owner to do this");
 }
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