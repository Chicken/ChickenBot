const Discord = require("discord.js");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Stats")
        .addField("<:js:525156067743891486>node.js version", `${process.version}`, true)
        .addField("<:bot:520718822152470530>discord.js version", `${Discord.version}`, true)
        .addField("⏱Uptime", client.formatDuration(client.uptime), true)
        .addField("💽Ram", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField(`${client.ws.ping > 100 ? "<a:e:525001588935360522>" : "<a:e:524998745721536514>"}Ping`, `${Math.floor(client.ws.ping)}ms!`, true)
        .addField("👥Users", `${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} servers.`, true)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 280576,
    guildOnly: false,
    aliases: ["status", "data"],
    name: "stats",
    desc: "Show info and stats about the bot and the host.",
    usage: "stats",
    perm: 0
};
