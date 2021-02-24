let discord = require("discord.js");
exports.execute = async (client, message, args) => {
    let gif = await client.random_choice(client.gifs.get("pat"));
    let embed = new discord.RichEmbed()
        .setAuthor("pat")
        .setImage(gif);
    let name;
    let patted;
    let outstr = args.join(" ");
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    if (args.length==1&&message.mentions.users.length==1) patted = message.mentions.users.first().username;
    if (patted) outstr = `${name} pats ${patted}`;
    if (!outstr||outstr=="") outstr = `${name} needs headpats ...`;
    embed.setColor("RANDOM");
    embed.setDescription(outstr);
    message.channel.send(embed);
};

exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: [],
    name: "pat",
    desc: "Give somebody headpats",
    usage: "pat [Mention/Text]",
    perm: 0
};