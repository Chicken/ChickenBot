let discord = require("discord.js");
exports.execute = async (client, message, args) => {
    let gif = await client.random_choice(client.gifs.get("kiss"));
    let embed = new discord.RichEmbed()
        .setAuthor("kiss")
        .setImage(gif);
    let name;
    let kissed;
    let outstr = args.join(" ");
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    if (args.length==1&&message.mentions.users.length==1) kissed = message.mentions.users.first().username;
    if (kissed) outstr = `${name} kisses ${kissed} OwO`;
    if (!outstr||outstr=="") outstr = `${name} needs kisses UwU`;
    embed.setColor("RANDOM");
    embed.setDescription(outstr);
    message.channel.send(embed);
};

exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: [],
    name: "kiss",
    desc: "Kiss somebody",
    usage: "kiss [Mention/Text]",
    perm: 0
};