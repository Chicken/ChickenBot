const Discord = require("discord.js");
module.exports = async (client, guild) => {
    console.log(`${client.colors.Yellow}Joined guild ${guild.name} (${guild.id})${client.colors.Reset}`);
    client.user.setActivity(`people on ${client.guilds.cache.size} servers`, { type: "WATCHING" });
    const embed = new Discord.MessageEmbed()
    .setTitle('Server joined')
    .setDescription(`Joined a server called ${guild.name} (${guild.id})`)
    .setColor('00ffff')
    .setTimestamp()
    client.channels.cache.get(client.config.log).send(embed)
}