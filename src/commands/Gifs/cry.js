const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = (client, message, args) => {
    let gif = client.random_choice(client.gifs.get("cry"));
    let name;
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    let embed = new Discord.MessageEmbed()
        .setAuthor("cry")
        .setImage(gif)
        .setColor("RANDOM")
        .setDescription(`${name} cries...`);
    message.channel.send(embed);
};

exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: [],
    name: "cry",
    desc: "Just cry ...",
    usage: "cry",
    perm: 0
};