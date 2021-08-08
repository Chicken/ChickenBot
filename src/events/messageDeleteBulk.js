const { MessageEmbed, Permissions } = require("discord.js");

module.exports = async (client, deletedMessages) => {
    if (!deletedMessages.first().guild) return;
    client.db.ensure(deletedMessages.first().guild.id, client.config.defaultSettings);
    const log = client.db.get(deletedMessages.first().guild.id, "settings.log");
    if (!log) return;
    const embed = new MessageEmbed()
        .setDescription(
            `**Bulk Message Delete**\n${
                deletedMessages.size
            } messages were deleted in ${deletedMessages.first().channel.toString()} \`#${
                deletedMessages.first().channel.name
            }\``
        )
        .setColor("f54242")
        .setTimestamp();
    let txt = `${deletedMessages.size} messages deleted in #${
        deletedMessages.first().channel.name
    }\n\n`;
    deletedMessages.forEach((m) => {
        const attachments = m.attachments
            ? `\n${m.attachments.map((a) => a.proxyURL).join(", ")}`
            : "";
        txt += `${m.author.tag}(${m.author.id}) at ${new Date(m.createdTimestamp).toLocaleString(
            "en-GB",
            { timeZone: "UTC" }
        )} UTC ID: ${m.id}\n${m.content}${attachments}\n\n`;
    });
    const buffer = Buffer.from(txt, "utf-8");
    const logChannel = client.channels.cache.get(log);
    if (
        logChannel &&
        logChannel
            .permissionsFor(client.user)
            .has([
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.ATTACH_FILES,
                Permissions.FLAGS.VIEW_CHANNEL,
            ])
    )
        logChannel.send({ embeds: [embed], files: [{ name: "logs.txt", attachment: buffer }] });
};
