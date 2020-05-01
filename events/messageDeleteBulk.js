const Discord = require("discord.js");
module.exports = async (client, deletedMessages) => {
    const embed = new Discord.MessageEmbed()
    .setDescription(`**Bulk Message Delete**\n${deletedMessages.size} messages were deleted in ${deletedMessages.first().channel.toString()} \`#${deletedMessages.first().channel.name}\``)
    .setColor("ff0000")
    .setTimestamp()
    let txt = `${deletedMessages.size} messages deleted in #${deletedMessages.first().channel.name}\n\n`
    deletedMessages.forEach(m=>{
      let attachments = m.attachments ? "\n"+m.attachments.map(a=>a.proxyURL).join(", ") : ""
      txt+=`${m.author.tag}(${m.author.id}) at ${new Date(m.createdTimestamp).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC ID: ${m.id}\n${m.content}${attachments}\n\n`
    })
    let buffer = new Buffer.from(txt, "utf-8")
    client.channels.cache.get(client.config.log).send({embed: embed, files: [{name:"logs.txt", attachment: buffer}]})
    let log = client.db.get(deletedMessages.first().guild.id, "settings.log");
    if(log){
      client.channels.cache.get(log).send({embed: embed, files: [{name:"logs.txt", attachment: buffer}]})
    }
}