let Discord = require("discord.js");
exports.execute = async (client, message, args) => {
    let gif = client.random_choice(client.gifs.get("hug"));
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
    if (target) outstr = `${name} hugs ${target}`;
    if (!outstr || outstr == "") outstr = `${name} needs hugs ...`;
    let embed = new Discord.MessageEmbed()
        .setAuthor("hug")
        .setImage(gif)
        .setColor("RANDOM")
        .setDescription(outstr);
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