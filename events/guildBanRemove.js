const Discord = require("discord.js");
module.exports = async (client, guild, member) => {
    if(client.db.get(guild.id, "banned").hasOwnProperty(member.id)){
        client.clearTimeout(client.bantimers[`${guild.id}-${member.id}`])
        delete client.bantimers[`${guild.id}-${member.id}`]
        client.db.deleteProp(guild.id, `banned.${member.id}`)
    }
}