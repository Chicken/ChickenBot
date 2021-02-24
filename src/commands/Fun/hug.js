const links = require("../../resources/hugs.json");
const Discord = require("discord.js");

// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send("You never said who you want to hug ;-;");

    let ping = args[0].match(/<@!?(\d+)>/);
    let target;
    if(ping && ping[1]) {
        let user = await client.users.fetch(ping[1]);
        if(user) target  = user.username;
        else target = args.join(" ");
    } else target = args.join(" ");

    let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.author.username}** hugs **${target}**`)
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
