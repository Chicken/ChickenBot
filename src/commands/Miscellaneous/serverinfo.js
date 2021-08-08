const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const server = message.guild;
    let bans;
    try {
        bans = await message.guild.bans.fetch();
        bans = bans.size.toString();
    } catch (e) {
        bans = "Data not available.";
    }
    const embed = new Discord.MessageEmbed()
        .setAuthor(`${server.name}`, `${server.iconURL()}`)
        .setThumbnail(`${server.iconURL()}`)
        .addField("Server ID", server.id, true)
        .addField("Owner", (await server.fetchOwner()).user.toString(), true)
        .addField("Members", server.memberCount.toString())
        .addField(
            "Channels",
            `${message.guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size} [${
                message.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size
            } text | ${
                message.guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size
            } voice]`
        )
        .addField("Roles", message.guild.roles.cache.size.toString(), true)
        .addField("Ban count", bans, true)
        .addField("Boost Tier", server.premiumTier.replaceAll("_", " ").toLowerCase(), true)
        .addField(
            "Created",
            `<t:${client.toUnix(server.createdTimestamp)}> (<t:${client.toUnix(
                server.createdTimestamp
            )}:R>)`
        )
        .setFooter(`Requested by ${message.author.tag}`)
        .setColor("AQUA")
        .setTimestamp();
    if (client.db.get(message.guild.id).settings.description) {
        embed.setDescription(client.db.get(message.guild.id).settings.description);
    }
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 18432n,
    guildOnly: true,
    aliases: ["server", "guild"],
    name: "serverinfo",
    desc: "Shows info about server.",
    usage: "serverinfo",
    perm: 0,
};
