const discord = require("discord.js");
const config = require("../../config.js");
module.exports = {
  name: "announcement",
  aliases: ["sendembed", "announce"],
 run: async(client, message, args) => {
if(!args[0])
{
  return message.channel.send("give me something to say in embed.");
}
  let guild1 = client.guilds.cache.get(config.server.id)
   let member1 = guild1.member(message.author.id);
   if(member1.roles.cache.has("849653061893750824") || member1.roles.cache.has("849653292769869855"))
{
  const embed = new discord.MessageEmbed()
  .setDescription(args.join(" "))
  .setColor("BLUE")
message.channel.send(embed);
message.delete()
}
 }
}