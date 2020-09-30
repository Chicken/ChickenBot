const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let server = message.guild;
    let bans = await message.guild.fetchBans();
    let embed = new Discord.MessageEmbed()
        .setAuthor(`${server.name}`, `${server.iconURL()}`)
        .setThumbnail(`${server.iconURL()}`)
        .addField("Server ID", server.id, true)
        .addField("Owner", server.owner.user.toString(), true)
        .addField("Members", `${server.members.cache.size} [${server.members.cache.filter(m => !m.user.bot).size} users | ${server.members.cache.filter(m => m.user.bot).size} bots]\n${server.members.cache.filter(m => m.presence.status === "online").size} online`)
        .addField("Channels", `${message.guild.channels.cache.filter(c=>c.type!="category").size} [${message.guild.channels.cache.filter(c=>c.type==="text").size} text | ${message.guild.channels.cache.filter(c=>c.type==="voice").size} voice]`)
        .addField("Roles", message.guild.roles.cache.size, true)
        .addField("Region", server.region)
        .addField("Ban count", bans.size)
        .addField("Boost Tier", server.premiumTier)
        .addField("Created", client.formatDate(server.createdAt))
        .setFooter(`Requested by ${message.author.tag}`)
        .setColor("AQUA")
        .setTimestamp();
    if(client.db.get(message.guild.id).settings.description){
        embed.setDescription(client.db.get(message.guild.id).settings.description);
    }
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 18432,
    guildOnly: true,
    aliases: ["server", "guild"],
    name: "serverinfo",
    desc: "Shows info about server.",
    usage: "serverinfo",
    perm: 0
};