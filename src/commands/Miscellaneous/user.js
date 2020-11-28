const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let fullname = args.join(" ").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let info;
    if(args[0]) {
        info = args[0].match(/^<@!?(\d+)>/)
            || message.guild.members.cache.find(m => m.user.username.match(new RegExp(fullname, "ui")))
            || message.guild.members.cache.find(m => m.id.match(new RegExp(fullname, "ui")))
            || message.guild.members.cache.find(m => { if (m.nickname) { return m.nickname.match(new RegExp(fullname, "ui")); } });
        if (Array.isArray(info)) info = message.guild.members.cache.get(info[1]);
        try {
            if(!info) info = await client.users.fetch(fullname);
        } catch(e) {}
        if(!info) return message.channel.send("No user found.");
        info = await client.users.cache.get(info.id) || await client.users.fetch(info.id);
    } else {
        info = message.author;
    }    
 
    let member = message.guild.members.cache.get(info.id);
    
    if(!member) {
        let embed = new Discord.MessageEmbed()
            .setTitle(info.tag + (info.flags && info.flags.has("SYSTEM") ? " :regional_indicator_s::regional_indicator_y::regional_indicator_s::regional_indicator_t::regional_indicator_e::regional_indicator_m:" : (info.bot ? " :regional_indicator_b::regional_indicator_o::regional_indicator_t:" : "")))
            .setThumbnail(info.displayAvatarURL({dynamic: true}))
            .setDescription("Ping: " + info.toString());
        if(info.flags && info.flags.toArray().length) {
            embed.addField("Badges", info.flags.toArray().map(v => v.toLowerCase().replace(/_/g, " ")).join(", ").replace(/\b(.)/g, c => c.toUpperCase()));
        }
        embed.addField("Id", info.id);
        embed.addField("Created", client.formatDate(info.createdAt));
        embed.setFooter(`Requested by ${message.author.tag}`);
        embed.setTimestamp();
        return message.channel.send(embed);
    }

    let roles = "‎";
    member.roles.cache.forEach(role => { if (role.name === "@everyone") return; roles += `<@&${role.id}> `; });

    let status = ({
        "online": ":green_circle:",
        "idle": ":yellow_circle:",
        "dnd": ":red_circle:",
        "offline": ":black_circle:"
    })[info.presence.status];

    let boosting = (member.premiumSince ? `Since ${client.formatDate(member.premiumSince)}` : "Not boosting :(");
 
    let presence = "";
    if(info.presence.activities.length != 0) {
        presence = "**Statuses:**\n";
        info.presence.activities.forEach(act => {
            presence += `__*${act.name}*__\n`
            + (act.details ? act.details + "\n" : "")
            + (act.state ? act.state + "\n" : "")
            + "\n";
        });
        presence = presence.substring(0, presence.length - 1);
    }

    let embed = new Discord.MessageEmbed()
        .setTitle(info.tag + (info.flags && info.flags.has("SYSTEM") ?
            " :regional_indicator_s::regional_indicator_y::regional_indicator_s::regional_indicator_t::regional_indicator_e::regional_indicator_m: "
            : (info.bot ? " :regional_indicator_b::regional_indicator_o::regional_indicator_t: " : " "))
            + status
        )
        .setThumbnail(info.displayAvatarURL({dynamic: true}))
        .setColor(member.displayHexColor)
        .setDescription("Ping: " + info.toString() + "\n\n" + presence);
    if(info.flags && info.flags.toArray().length) {
        embed.addField("Badges", info.flags.toArray().map(v => v.toLowerCase().replace(/_/g, " ")).join(", ").replace(/\b(.)/g, c => c.toUpperCase()));
    }    
    embed
        .addField("Join Position", (message.guild.members.cache.array().sort((m, m2) => { return m.joinedTimestamp - m2.joinedTimestamp; }).map(m => m.id).indexOf(info.id) + 1) + "/" + message.guild.memberCount, true)
        .addField("Boosting", boosting, true)
        .addField("Id", info.id)
        .addField("Created", client.formatDate(info.createdAt), true)
        .addField("Joined", client.formatDate(member.joinedAt), true)
        .addField("Roles", roles)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 280576,
    guildOnly: true,
    aliases: ["info", "userinfo", "whois"],
    name: "user",
    desc: "Gives you info about a user.",
    usage: "user [user]",
    perm: 0
};