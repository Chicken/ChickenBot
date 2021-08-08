const Discord = require("discord.js");

exports.execute = async (client, message, args) => {
    const gif = client.arrayRandom(client.gifs.kiss);
    let outstr;
    const ping = args[0]?.match(/<@!?(\d+)>/);
    let target;
    if (ping && ping[1]) {
        const user = await client.users.fetch(ping[1]);
        if (user) target = user.username;
        else target = args.join(" ");
    } else target = args.join(" ");

    let name;
    if (message.member) {
        name = message.member.displayName;
    } else {
        name = message.author.username;
    }
    if (target) outstr = `${name} kisses ${target} OwO`;
    if (!outstr || outstr === "") outstr = `${name} needs kisses UwU`;
    const embed = new Discord.MessageEmbed()
        .setImage(gif)
        .setColor("RANDOM")
        .setTitle(outstr)
        .setFooter("Hosted by weeb.sh");
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 18432n,
    guildOnly: false,
    aliases: [],
    name: "kiss",
    desc: "Kiss somebody",
    usage: "kiss [Mention/Text]",
    perm: 0,
};
