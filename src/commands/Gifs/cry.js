const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = (client, message, args) => {
    const gif = client.arrayRandom(client.gifs.cry);
    let name;
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    const embed = new Discord.MessageEmbed()
        .setImage(gif)
        .setColor("RANDOM")
        .setTitle(`${name} cries...`)
        .setFooter("Hosted by weeb.sh");
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 18432n,
    guildOnly: false,
    aliases: [],
    name: "cry",
    desc: "Just cry ...",
    usage: "cry",
    perm: 0,
};
