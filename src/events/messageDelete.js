const Discord = require("discord.js");
module.exports = async (client, messageDelete) => {
    if(!messageDelete.guild) return;
    client.db.ensure(messageDelete.guild.id, client.config.defaultSettings);
    let log = client.db.get(messageDelete.guild.id).settings.log;
    if(!log) return;
    const embed = new Discord.MessageEmbed()
        .setDescription(`**Message Deleted**\n**User:** ${messageDelete.author.tag}\n**Channel:** ${messageDelete.channel.toString()} \`#${messageDelete.channel.name}\`\n\n**Message:**\n${messageDelete.content}`)
        .setColor("f54242")
        .setTimestamp();
    if (messageDelete.attachments.size != 0) {
        embed.addField("Attachments", messageDelete.attachments.map(v => `[${v.name}](${v.proxyURL})`).join(" "));
    }
    let logChannel = client.channels.cache.get(log);
    if(logChannel && logChannel.permissionsFor(client.user).has([ "SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL" ])) logChannel.send(embed);
};
