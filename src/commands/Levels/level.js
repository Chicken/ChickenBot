const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const fullname = args.join(" ").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let user;
    if (args[0]) {
        user =
            args[0].match(/^<@!?(\d+)>/) ||
            message.guild.members.cache.find((m) =>
                m.user.username.match(new RegExp(fullname, "ui"))
            ) ||
            message.guild.members.cache.find((m) => m.id.match(new RegExp(fullname, "ui"))) ||
            message.guild.members.cache.find((m) => m.nickname?.match(new RegExp(fullname, "ui")));
        if (Array.isArray(user)) user = message.guild.members.cache.get(user[1]);
        if (!user) return message.channel.send("No user found.");
        user = (await client.users.cache.get(user.id)) || (await client.users.fetch(user.id));
    } else {
        user = message.author;
    }

    if (!client.db.get(message.guild.id, "settings.xp")) {
        return message.channel.send("Leveling is not enabled in your server!");
    }
    const { xp, level } = client.db.get(message.guild.id, `users.${user.id}`);
    const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(`**Stats for ${user.tag}**`)
        .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
        .setFooter(`Requested by ${message.author.tag}`)
        .setDescription(
            `**Level:** ${level}\n` +
                `**Total xp:** ${xp}\n` +
                `**Xp on this level:** ${xp - (level * 10) ** 2}\n` +
                `**Xp untill next level:** ${((level + 1) * 10) ** 2 - xp}`
        );
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 18432n,
    guildOnly: false,
    aliases: ["rank", "xp"],
    name: "level",
    desc: "See your (or someone elses) current xp and level",
    usage: "level [user]",
    perm: 0,
};
