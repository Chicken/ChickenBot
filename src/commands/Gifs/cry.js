let discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let gif = await client.random_choice(client.gifs.get("cry"));
    let embed = new discord.MessageEmbed()
        .setAuthor("cry")
        .setImage(gif);
    let name;
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    embed.setColor("RANDOM");
    embed.setDescription(`${name} cries...`);
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