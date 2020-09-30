const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let fullname = args.join(" ");
    let user;
    if(args[0]) {
        user = args[0].match(/^<@!?(\d+)>/)
            || message.guild.members.cache.find(m => m.user.username.match(new RegExp(fullname, "ui")))
            || message.guild.members.cache.find(m => m.id.match(new RegExp(fullname, "ui")))
            || message.guild.members.cache.find(m => { if (m.nickname) { return m.nickname.match(new RegExp(fullname, "ui")); } });
        if (Array.isArray(user)) user = message.guild.members.cache.get(user[1]);
        if(!user) return message.channel.send("No user found.");
        user = await client.users.cache.get(user.id) || await client.users.fetch(user.id);
    } else {
        user = message.author;
    }

    if(!client.db.get(message.guild.id, "settings.xp")) {
        return message.channel.send("Leveling is not enabled in your server!");
    }
    let { xp, level } = client.db.get(message.guild.id, `users.${user.id}`);
    let embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription(`**Level:** ${level}
                    **Total xp:** ${xp}
                    **Xp on this level:** ${xp-Math.pow((level*10), 2)}
                    **Xp untill next level:** ${Math.pow(((level + 1) * 10), 2) - xp}`);
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: ["rank", "xp"],
    name: "level",
    desc: "See your (or someone elses) current xp and level",
    usage: "level [user]",
    perm: 0
};