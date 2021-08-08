const bent = require("bent");
const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (args[0] == null || Number.isNaN(parseInt(args[0], 10))) {
        return message.channel.send("That's not a valid http status code.");
    }
    try {
        await bent("GET", 200, `https://http.cat/${args[0]}`)();
    } catch (e) {
        return message.channel.send("That's not a valid http status code.");
    }
    const embed = new Discord.MessageEmbed()
        .setTitle(`According to cats ${args[0]} is`)
        .setImage(`https://http.cat/${args[0]}`)
        .setFooter("Powered by http.cat");
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 18432n,
    guildOnly: false,
    aliases: ["httpcat"],
    name: "http",
    desc: "Nice cat pics but for http status codes",
    usage: "http <code>",
    perm: 0,
};
