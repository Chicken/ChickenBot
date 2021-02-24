const Discord = require("discord.js");
exports.execute = async (client, message, args) => {
    let gif = client.arrayRandom(client.gifs["cuddle"]);
    let outstr;
    let ping = args[0].match(/<@!?(\d+)>/);
    let target;
    if (ping && ping[1]) {
        let user = await client.users.fetch(ping[1]);
        if (user) target = user.username;
        else target = args.join(" ");
    } else target = args.join(" ");

    let name;
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    if (target) outstr = `${name} cuddles ${target}`;
    if (!outstr || outstr == "") outstr = `${name} needs cuddles ...`;
    let embed = new Discord.MessageEmbed()
        .setAuthor("cuddle")
        .setImage(gif)
        .setColor("RANDOM")
        .setDescription(outstr);
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