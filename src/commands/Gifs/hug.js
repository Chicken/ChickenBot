let discord = require("discord.js");
exports.execute = async (client, message, args) => {
    let gif = await client.random_choice(client.gifs.get("hug"));
    let embed = new discord.RichEmbed()
        .setAuthor("hug")
        .setImage(gif);
    let name;
    let hugged;
    let outstr = args.join(" ");
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    if (args.length==1&&message.mentions.users.length==1) hugged = message.mentions.users.first().username;
    if (hugged) outstr = `${name} hugs ${hugged}`;
    if (!outstr||outstr=="") outstr = `${name} needs hugs ...`;
    embed.setColor("RANDOM");
    embed.setDescription(outstr);
    message.channel.send(embed);
};

exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: [],
    name: "hug",
    desc: "Hug somebody",
    usage: "hug [Mention/Text]",
    perm: 0
};