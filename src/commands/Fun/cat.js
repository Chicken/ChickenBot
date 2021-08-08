const bent = require("bent");
const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const body = await bent("GET", 200, "json", { "x-api-key": client.config.thecatapi })(
        `https://api.thecatapi.com/v1/images/search${args[0] === "gif" ? "?mime_types=gif" : ""}`
    );
    const embed = new Discord.MessageEmbed()
        .setTitle("UwU here's a cat for u")
        .setImage(body[0].url)
        .setFooter("Powered by thecatapi.com");
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 51200n,
    guildOnly: false,
    aliases: ["kitty", "uwu", "owo"],
    name: "cat",
    desc: "Nice cat pics uwu",
    usage: "cat [gif]",
    perm: 0,
};
