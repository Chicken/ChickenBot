const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let fullname = args.join(" ");
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
    
    if(!    member) {
        let embed = new Discord.MessageEmbed()
            .setTitle(info.tag)
            .setThumbnail(info.displayAvatarURL())
            .setColor("FF00FF")
            .setDescription(info.toString());
        if(info.flags.toArray().length) {
            embed.addField("Badges", info.flags.toArray().map(v => v.toLowerCase().replace(/_/g, " ")).join(", ").replace(/\b(.)/g, c => c.toUpperCase()));
        }
        embed.addField("Id", info.id, true);
        embed.addField("Bot", (info.flags.has("SYSTEM") ? "System" : (info.bot ? "Yes" : "No")), true);
        embed.addField("Created", client.formatDate(info.createdAt));
        embed.setFooter(`Requested by ${message.author.tag}`);
        embed.setTimestamp();
        return message.channel.send(embed);
    }

    let roles = "‎";
    member.roles.cache.forEach(role => { if (role.name === "@everyone") return; roles += `<@&${role.id}> `; });
    let     nickname = member.nickname || "No nickname";
    let     status = info.presence.status === "dnd" ? "do not disturb" : info.presence.status;
    let embed = new Discord.MessageEmbed()
        .setTitle(info.tag)
        .setThumbnail(info.displayAvatarURL())
        .setColor("FF00FF")
        .setDescription(info.toString());
    if(info.flags.toArray().length) {
        embed.addField("Badges", info.flags.toArray().map(v => v.toLowerCase().replace(/_/g, " ")).join(", ").replace(/\b(.)/g, c => c.toUpperCase()));
    }    
    embed.addField("Nickname", nickname, true);
    embed.addField("Id", info.id, true);
    embed.addField("Status", status, true);
    embed.addField("Bot", (info.flags.has("SYSTEM") ? "System" : (info.bot ? "Yes" : "No")), true);
    embed.addField("Join Position", (message.guild.members.cache.array().sort((m, m2) => { return m.joinedTimestamp - m2.joinedTimestamp; }).map(m => m.id).indexOf(info.id) + 1) + "/" + message.guild.memberCount, true);
    embed.addField("Created", client.formatDate(info.createdAt));
    embed.addField("Joined", client.formatDate(member.joinedAt));
    embed.addField("Roles", roles);
    embed.setFooter(`Requested by ${message.author.tag}`);
    embed.setTimestamp();
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 280576,
    guildOnly: true,
    aliases: ["info", "userinfo"],
    name: "user",
    desc: "Gives you info about a user.",
    usage: "user [user]",
    perm: 0
};