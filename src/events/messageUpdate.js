const { MessageEmbed, Permissions } = require("discord.js");

module.exports = async (client, oldm, newm) => {
    if (!oldm.guild) return;
    client.db.ensure(oldm.guild.id, client.config.defaultSettings);
    if (newm.content === oldm.content) return;
    const { log } = client.db.get(oldm.guild.id).settings;
    if (!log) return;
    const embed = new MessageEmbed()
        .setDescription(
            `**Message Edited**\n**User:** ${oldm.author.toString()}\n**Channel:** ${oldm.channel.toString()} \`#${
                oldm.channel.name
            }\`\n\n**New message:**\n${newm.content}\n\n**Old message:**\n${oldm.content}`
        )
        .setColor("2a97f7")
        .setTimestamp();
    const logChannel = client.channels.cache.get(log);
    if (
        logChannel &&
        logChannel
            .permissionsFor(client.user)
            .has([
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.VIEW_CHANNEL,
            ])
    )
        logChannel.send({ embeds: [embed] });
};
