const config = require("../../config.js");
module.exports = {
  name: "say",
  aliases: ["s"],
 run: async(client, message, args) => {
if(!args[0])
{
  return message.channel.send("give me something to say.");
}
  let guild1 = client.guilds.cache.get(config.server.id)
   let member1 = guild1.member(message.author.id);
   if(member1.roles.cache.has("849653061893750824") || member1.roles.cache.has("849653292769869855"))
{
message.channel.send(args.join(" "));
}
 }
}