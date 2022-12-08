/* eslint-disable no-bitwise */
const Discord = require("discord.js");
const fetch = require("node-fetch");

const appCache = new Map();

const getApp = async (id) => {
    if (appCache.has(id)) {
        const { app, expiry } = appCache.get(id);
        if (expiry > Date.now()) return app;
    }
    const app = await fetch(`https://discord.com/api/v9/oauth2/applications/${id}/rpc`)
        .then((r) => r.json())
        .then((j) => {
            if (j.code)
                // An error occurred
                throw new Error(j.message);
            return j;
        })
        .catch(() => null);
    appCache.set(id, { app, expiry: Date.now() + 1000 * 60 * 60 }); // 1 hour
    return app;
};

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

    const extraFields = [];
    if (info.bot) {
        const application = await getApp(info.id);
        if (application) {
            // Links
            let links = "";
            if (application.bot_public) {
                if (application.custom_install_url)
                    links += `[Invite](${application.custom_install_url})`;
                else {
                    const params = {};
                    params.client_id = application.id;
                    if (application.install_params) {
                        if (application.install_params.permissions)
                            params.permissions = application.install_params.permissions;
                        if (application.install_params.scopes)
                            params.scope = application.install_params.scopes.join(" ");
                    }
                    links += `[Invite](https://discord.com/oauth2/authorize?${new URLSearchParams(
                        params
                    )})`;
                }
            }
            if (application.terms_of_service_url)
                links += ` | [ToS](${application.terms_of_service_url})`;
            if (application.privacy_policy_url)
                links += ` | [Privacy](${application.privacy_policy_url})`;
            if (links) extraFields.push({ name: "Links", value: links });
            // Description
            if (application.description)
                extraFields.push({ name: "Description", value: application.description });
            // Tags
            if (application.tags)
                extraFields.push({ name: "Tags", value: application.tags.join(", ") });
            // Flags
            if (application.flags) {
                const flags = [];
                if (application.flags & 4096 || application.flags & 8192)
                    flags.push("Presence Intent");
                if (application.flags & 16384 || application.flags & 32768)
                    flags.push("Server Members Intent");
                if (application.flags & 262144 || application.flags & 524288)
                    flags.push("Message Content Intent");
                if (application.flags & 8388608) flags.push("Uses Slash Commands");

                if (flags.length) extraFields.push({ name: "Flags", value: flags.join(", ") });
            }
        }
    }

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

        if (extraFields.length) embed.addFields(extraFields);
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

    if (extraFields.length) embed.addFields(extraFields);
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
