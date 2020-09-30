const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send("Mention someone!");
    let user = args[0].match(/^<@!?(\d+)>/)
    || message.guild.members.cache.find(m => m.user.username.match(new RegExp(args[0], "ui")))
    || message.guild.members.cache.find(m => m.id.match(new RegExp(args[0], "ui")))
    || message.guild.members.cache.find(m => { if (m.nickname) { return m.nickname.match(new RegExp(args[0], "ui")); } });
    if (Array.isArray(user)) user = message.guild.members.cache.get(user[1]);
    if(!user) return message.channel.send("No user found.");
    if (!user.bannable) return message.channel.send("Can't ban that user!");
    args.shift();
    let reason = args.join(" ");
    if (reason === "") reason = "None";
    try{
        await user.send(`You have been softbanned from "${message.guild.name}" for reason "${reason}"`);
    } catch(e){}
    await user.ban({ days: 7, reason: `Softbanned ${reason}` });
    await message.guild.members.unban(user.id, `Softbanned: ${reason}`);
    message.channel.send(`Softbanned user \`${user.user.tag}\` with reason "${reason}".`);
    let embed = new Discord.MessageEmbed()
        .setTitle("Softbanned")
        .setDescription(`\`${user.user.tag}\` was softbanned by \`${message.author.tag}\` for reason "${reason}"`)
        .setColor("RED")
        .setTimestamp();
    let log = client.db.get(message.guild.id).settings.log;
    if(log){
        client.channels.cache.get(log).send(embed);
    }
};
  
exports.data = {
    permissions: 18436,
    guildOnly: true,
    aliases: [],
    name: "softban",
    desc: "Softbans a user. (bans, deletes messages from 7 days and unbans)",
    usage: "softban <user> [reason]",
    perm: 1
};