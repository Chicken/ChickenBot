const Discord = require("discord.js");
module.exports = async (client, oldm, newm) => {
    if(!oldm.guild) return;
    if(newm.content===oldm.content) return;
    const embed = new Discord.MessageEmbed()
    .setDescription(`**Message Edited**\n**User:** ${oldm.author.toString()}\n**Channel:** ${oldm.channel.toString()} \`#${oldm.channel.name}\`\n\n**New message:**\n${newm.content}\n\n**Old message:**\n${oldm.content}`)
    .setColor("0000ff")
    .setTimestamp()
    client.channels.cache.get(client.config.log).send(embed)
    let log = client.db.get(oldm.guild.id).settings.log;
    if(log){
      client.channels.cache.get(log).send(embed)
    }
}