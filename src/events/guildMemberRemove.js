let { MessageEmbed } = require("discord.js");

module.exports = async (client, member) => {
    client.db.ensure(member.guild.id, client.config.defaultSettings);
    if(client.db.has(member.guild.id, `users.${member.id}`)) {
        client.db.delete(member.guild.id, `users.${member.id}`);
    }
    let log = client.db.get(member.guild.id).settings.log;
    if(!log) return;
    let embed = new MessageEmbed()
        .setTitle("Member left!")
        .setColor("#c634eb")
        .setDescription(`${member.toString()} ${member.user.tag} (\`${member.id}\`)`)
        .setTimestamp();
    let logChannel = client.channels.cache.get(log);
    if(logChannel && logChannel.permissionsFor(client.user).has([ "SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL" ])) logChannel.send(embed);
};
