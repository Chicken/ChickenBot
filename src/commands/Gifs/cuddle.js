let discord = require("discord.js");
exports.execute = async (client, message, args) => {
    let gif = await client.random_choice(client.gifs.get("cuddle"));
    let embed = new discord.RichEmbed()
        .setAuthor("cuddle")
        .setImage(gif);

    let name;
    let cuddled;
    let outstr = args.join(" ");
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    if (args.length==1&&message.mentions.users.length==1) cuddled = message.mentions.users.first().username;
    if (cuddled) outstr = `${name} cuddles ${cuddled}`;
    if (!outstr||outstr=="") outstr = `${name} needs cuddles ...`;
    embed.setColor("RANDOM");
    embed.setDescription(outstr);
    message.channel.send(embed);
};

exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: ["snuggle"],
    name: "cuddle",
    desc: "Cuddle somebody",
    usage: "cuddle [Mention/Text]",
    perm: 0
};