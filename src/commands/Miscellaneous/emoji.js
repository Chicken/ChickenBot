const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send("You must give me the custom emoji to download duh!");
    const result = args[0].match(/<(a)?:(.+):(\d+)>/);
    if (result == null) {
        return message.channel.send("Not a valid emoji! (Or non custom)");
    }
    const animated = !!result[1];
    const name = result[2];
    const id = result[3];

    message.channel.send({
        files: [
            new Discord.MessageAttachment(
                `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`,
                `${name}.${animated ? "gif" : "png"}`
            ),
        ],
    });
};

exports.data = {
    permissions: 34816n,
    guildOnly: false,
    aliases: ["steal", "stealemoji"],
    name: "emoji",
    desc: "turns custom emoji into a downloadable file",
    usage: "emoji <emoji>",
    perm: 0,
};
