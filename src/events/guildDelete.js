const Discord = require("discord.js");

// eslint-disable-next-line no-unused-vars
module.exports = async (client, guild) => {
    client.logger.info("Left a server.");
    client.user.setActivity(`people on ${client.guilds.cache.size} servers`, { type: "WATCHING" });

    const embed = new Discord.MessageEmbed()
        .setDescription("Left a server.")
        .setColor("ffcc00")
        .setTimestamp();
    client.channels.cache.get(client.config.log).send(embed);
};