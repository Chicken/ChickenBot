const Discord = require("discord.js");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const fullname = args.join(" ").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let info;
    if (args[0]) {
        info =
            args[0].match(/^<@!?(\d+)>/) ||
            message.guild.members.cache.find((m) =>
                m.user.username.match(new RegExp(fullname, "ui"))
            ) ||
            message.guild.members.cache.find((m) => m.id.match(new RegExp(fullname, "ui"))) ||
            message.guild.members.cache.find((m) => m.nickname?.match(new RegExp(fullname, "ui")));
        if (Array.isArray(info)) info = message.guild.members.cache.get(info[1]);
        try {
            if (!info) info = await client.users.fetch(fullname);
        } catch (e) {}
        if (!info) return message.channel.send("No user found.");
        info = (await client.users.cache.get(info.id)) || (await client.users.fetch(info.id));
    } else {
        info = message.author;
    }

    const member = message.guild.members.cache.get(info.id);

    if (!member) {
        const embed = new Discord.MessageEmbed()
            .setTitle(
                `${info.tag} ${
                    info.system
                        ? client.emojiText("system")
                        : info.bot
                        ? client.emojiText("bot")
                        : ""
                }`
            )
            .setThumbnail(info.displayAvatarURL({ dynamic: true }))
            .setDescription(`Ping: ${info.toString()}`);
        if (info.flags && info.flags.toArray().length) {
            embed.addField(
                "Badges",
                info.flags
                    .toArray()
                    .map((v) => v.toLowerCase().replace(/_/g, " "))
                    .join(", ")
                    .replace(/\b(.)/g, (c) => c.toUpperCase())
            );
        }
        embed.addField("Id", info.id, true);
        const permLvl = await client.perm({ author: info });
        embed.addField(
            "Bot Permission",
            `${permLvl} | ${client.config.perms.find((p) => p.level === permLvl).name}`,
            true
        );
        embed.addField(
            "Created",
            `<t:${client.toUnix(info.createdTimestamp)}> (<t:${client.toUnix(
                info.createdTimestamp
            )}:R>)`
        );
        embed.setFooter(`Requested by ${message.author.tag}`);
        embed.setTimestamp();
        return message.channel.send({ embeds: [embed] });
    }

    let roles = "‎";
    member.roles.cache.forEach((role) => {
        if (role.name === "@everyone") return;
        roles += `<@&${role.id}> `;
    });

    const boosting = member.premiumSince
        ? `Since <t:${client.toUnix(member.premiumSince)}> (<t:${client.toUnix(
              member.premiumSince
          )}:R>)`
        : "Not boosting :(";

    const embed = new Discord.MessageEmbed()
        .setTitle(
            `${info.tag} ${
                info.system ? client.emojiText("system") : info.bot ? client.emojiText("bot") : ""
            }`
        )
        .setThumbnail(info.displayAvatarURL({ dynamic: true }))
        .setColor(member.displayHexColor)
        .setDescription(`Ping: ${info.toString()}`);
    if (info.flags && info.flags.toArray().length) {
        embed.addField(
            "Badges",
            info.flags
                .toArray()
                .map((v) => v.toLowerCase().replace(/_/g, " "))
                .join(", ")
                .replace(/\b(.)/g, (c) => c.toUpperCase())
        );
    }
    const permLvl = await client.perm({ guild: message.guild, author: info, member });
    embed
        .addField("Boosting", boosting, true)
        .addField("Id", info.id)
        .addField(
            "Created",
            `<t:${client.toUnix(info.createdTimestamp)}>\n(<t:${client.toUnix(
                info.createdTimestamp
            )}:R>)`,
            true
        )
        .addField(
            "Joined",
            `<t:${client.toUnix(member.joinedTimestamp)}>\n(<t:${client.toUnix(
                member.joinedTimestamp
            )}:R>)`,
            true
        )
        .addField(
            "Bot Permission",
            `${permLvl} | ${client.config.perms.find((p) => p.level === permLvl).name}`
        )
        .addField("Roles", roles)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 280576n,
    guildOnly: true,
    aliases: ["info", "userinfo", "whois"],
    name: "user",
    desc: "Gives you info about a user.",
    usage: "user [user]",
    perm: 0,
};
