const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send("Mention someone!");
    let user = args[0].match(/^<@!?(\d+)>/)
    || message.guild.members.cache.find(m => { if (m.nickname) { return m.nickname.match(new RegExp(args[0], "ui")); } })
    || message.guild.members.cache.find(m => m.user.username.match(new RegExp(args[0], "ui")))
    || message.guild.members.cache.find(m => m.id.match(new RegExp(args[0], "ui")));
    if (Array.isArray(user)) user = message.guild.members.cache.get(user[1]);
    if(!user) return message.channel.send("No user found.");
    if (!user.kickable) return message.channel.send("Can't kick that user!");
    args.shift();
    let reason = args.join(" ");
    if (reason === "") reason = "None";
    try{
        await user.send(`You have been kicked from "${message.guild.name}" for reason "${reason}"`);
    } catch(e){}
    await user.kick({ reason: `Kicked ${reason}` });
    message.channel.send(`Kicked user \`${user.user.tag}\` with reason "${reason}".`);
    let embed = new Discord.MessageEmbed()
        .setTitle("Kicked")
        .setDescription(`\`${user.user.tag}\` was kicked by \`${message.author.tag}\` for reason "${reason}"`)
        .setColor("RED")
        .setTimestamp();
    let log = client.db.get(message.guild.id).settings.log;
    if(log){
        client.channels.cache.get(log).send(embed);
    }
};
  
exports.data = {
    permissions: 18434,
    guildOnly: true,
    aliases: [],
    name: "kick",
    desc: "Kicks user",
    usage: "kick <user> [reason]",
    perm: 1
};