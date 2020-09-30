const Discord = require("discord.js");

module.exports = async (client) => {
    client.logger.info("Joined a server.");
    client.user.setActivity(`people on ${client.guilds.cache.size} servers`, { type: "WATCHING" });

    const embed = new Discord.MessageEmbed()
        .setDescription("Joined a server.")
        .setColor("6f43ba")
        .setTimestamp();
    client.channels.cache.get(client.config.log).send(embed);
};