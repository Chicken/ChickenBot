const { MessageEmbed, Permissions } = require("discord.js");

module.exports = async (client, member) => {
    client.db.ensure(member.guild.id, client.config.defaultSettings);
    if (client.db.has(member.guild.id, `users.${member.id}`)) {
        client.db.delete(member.guild.id, `users.${member.id}`);
    }
    const { log } = client.db.get(member.guild.id).settings;
    if (!log) return;
    const embed = new MessageEmbed()
        .setTitle("Member left!")
        .setColor("#c634eb")
        .setDescription(`${member.toString()} ${member.user.tag} (\`${member.id}\`)`)
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
