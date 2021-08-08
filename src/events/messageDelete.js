const { MessageEmbed, Permissions } = require("discord.js");

module.exports = async (client, messageDelete) => {
    if (!messageDelete.guild) return;
    client.db.ensure(messageDelete.guild.id, client.config.defaultSettings);
    const { log } = client.db.get(messageDelete.guild.id).settings;
    if (!log) return;
    const embed = new MessageEmbed()
        .setDescription(
            `**Message Deleted**\n**User:** ${
                messageDelete.author.tag
            }\n**Channel:** ${messageDelete.channel.toString()} \`#${
                messageDelete.channel.name
            }\`\n\n**Message:**\n${messageDelete.content}`
        )
        .setColor("f54242")
        .setTimestamp();
    if (messageDelete.attachments.size !== 0) {
        embed.addField(
            "Attachments",
            messageDelete.attachments.map((v) => `[${v.name}](${v.proxyURL})`).join(" ")
        );
    }
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
