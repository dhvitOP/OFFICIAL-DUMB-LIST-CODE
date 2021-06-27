const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("../../config.js");
const { Client, Util } = require('discord.js');
module.exports = {
  name: "eval",
  aliases: [],
 run: async(client, message, args) => {
    if(!config.bot.owners.includes(message.author.id)) return  message.reply('could not be granted access permission.')
    try {
      var code = args.join(" ");
      var evaled =  await eval("(async () => {" + code + "})()");
 
      if (typeof evaled !== "string")
        evaled = require("util")
        evaled = await evaled.inspect(evaled);
      let Embed = new Discord.MessageEmbed()
                            .addField("Code","```js\n" + code + "```")
                            .setDescription("```js\n" + clean(evaled) + "```")
if (Embed.description.length >= 2048)
      Embed.description = Embed.description.substr(0, 2042) + "```...";
    return message.channel.send(Embed)
    } catch (err) {
      message.channel.send(`\`HATA\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
}
 
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};
 
exports.help = {
  name: 'eval',
  description: 'The code is used to test.',
  usage: 'eval [code]',
  category: 'owner'
}

const clean = text => {
  if (typeof(text) === "string")
  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
  return text;
}
function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }