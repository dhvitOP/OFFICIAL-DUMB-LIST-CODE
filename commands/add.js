const Discord = require('discord.js')
const vcodes = require("vcodes.js");
const profiledata = require("../database/models/profile.js")
const config = require("../../config.js");
const db = require("quick.db");
module.exports = {
  name: "add-private",
  aliases: ["add"],
 run: async(client, message, args) => {
if(message.author.id === "720632216236851260")

{

let tokentosave = makeToken(37)
await profiledata.findOneAndUpdate({userID: args[0]},{$set: {
              token: tokentosave,
          }
         })
         message.channel.send(`done added <@${args[0]}> in Private api Token is In your Dm`);
         message.author.send(`${tokentosave}`)
}

 }
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