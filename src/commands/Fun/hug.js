const links = require("../../resources/hugs.json");
const Discord = require("discord.js");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send("Mention someone!");
    let name = args.join(" ").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let target = name.match(/^<@!?(\d+)>/)
    || message.guild.members.cache.find(m => m.nickname ? m.nickname.match(new RegExp(name, "ui")) : false)
    || message.guild.members.cache.find(m => m.user.username.match(new RegExp(name, "ui")))
    || message.guild.members.cache.find(m => m.id.match(new RegExp(name, "ui")));
    if (Array.isArray(target)) target = message.guild.members.cache.get(target[1]);
    if(!target) return message.channel.send("No user found.");

    let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.author.username}** hugs **${target.user.username}**`)
        .setImage(links[Math.floor(Math.random() * links.length)])
        .setColor("#ff69b4")
        .setFooter("Images hosted by weeb.sh");
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 52224,
    guildOnly: true,
    aliases: ["cuddle"],
    name: "hug",
    desc: "Hug your friends and your enemies. Just hug everyone.",
    usage: "hug <user>",
    perm: 0
};
