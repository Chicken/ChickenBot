// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (args[0] === "set") {
        args.shift();
        switch (args[0]) {
        case "mod": {
            let role = message.guild.roles.cache.find(r => r.name.match(new RegExp(args[1], "iu"))) || message.guild.roles.cache.get(args[1]);
            if (!role) {
                return message.channel.send("No role found");
            }
            client.db.set(message.guild.id, role.id, "settings.mod");
            message.channel.send(`Set mod role to ${role.name} (${role.id})`);
            break;
        }
        case "prefix": {
            args.shift();
            client.db.set(message.guild.id, args.join(" "), "settings.prefix");
            message.channel.send(`Set prefix to ${args.join(" ")}`);
            break;
        }
        case "description": {
            args.shift();
            client.db.set(message.guild.id, args.join(" "), "settings.description");
            message.channel.send(`Set description to "${args.join(" ")}"`);
            break;
        }
        case "xp": {
            args.shift();
            if (args[0].toLowerCase() != "true" && args[0].toLowerCase() != "false") {
                return message.channel.send("Valid options are `true` and `false`");
            }
            client.db.set(message.guild.id, args[0].toLowerCase() == "true" ? true : false, "settings.xp");
            if (client.db.get(message.guild.id, "settings.xp")) {
                message.channel.send("Xp is now enabled!");
            } else {
                message.channel.send("Xp is now disabled!");
            }
            break;
        }
        case "log": {
            let channel = message.guild.channels.cache.find(c => c.name.match(new RegExp(args[1], "iu"))) || message.guild.channels.cache.get(args[1]);
            if (!channel) {
                return message.channel.send("No channel found");
            }
            client.db.set(message.guild.id, channel.id, "settings.log");
            message.channel.send(`Set log channel to ${channel.name} (${channel.id})`);
            break;
        }
        default: {
            return message.channel.send("Not a valid setting. Valid choices are log, mod, description, xp and prefix.");
        }
        }
    } else {
        let settings = client.db.get(message.guild.id).settings;
        message.channel.send(`Your current settings:\nPrefix: \`${settings.prefix}\`\nDescription: \`${settings.description ? settings.description : "None"}\`\nMod-Role: \`${settings.mod === null ? "None" : message.guild.roles.cache.get(settings.mod).name}\`\nLog: ${settings.log === null ? "No" : `<#${settings.log}>`}\nXp system enabled: \`${settings.xp}\``);
    }
};

exports.data = {
    permissions: 2048,
    guildOnly: true,
    aliases: ["setting"],
    name: "settings",
    desc: "Changes bot settings in the server",
    usage: "settings [set] <setting> <value>",
    perm: 2
};