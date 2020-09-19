module.exports = async (client, member) => {
    if(client.db.has(member.guild.id, `users.${member.id}`)) {
        client.db.delete(member.guild.id, `users.${member.id}`)
    }
}