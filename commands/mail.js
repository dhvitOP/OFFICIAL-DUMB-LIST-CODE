module.exports = {
  name: "email",
  aliases: ["emailsend"],
 run: async(client, message, args) => {
   if(message.member.roles.cache.has("849623732925366289"))
{
  const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'devdadhvit@gmail.com', // Change to your recipient
  from: 'devdadhvit@dumbbotlist.tk', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })


}
 }
}