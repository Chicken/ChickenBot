module.exports = async (client, member) => {
    client.db.ensure(member.guild.id, client.config.defaultSettings);
    if(client.db.has(member.guild.id, `users.${member.id}`)) {
        client.db.delete(member.guild.id, `users.${member.id}`);
    }
};