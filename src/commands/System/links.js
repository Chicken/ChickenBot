const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const embed = new Discord.MessageEmbed().setTitle("Links").setDescription(
        `${
            `[Invite](${client.generateInvite({
                permissions: 37088454n,
                scopes: ["bot", "applications.commands"],
            })})\n` +
            "[Support Server](https://discord.gg/jRN7SZB)\n" +
            "[Website]("
        }${client.config.hostname})\n` +
            `[Privacy Policy](${client.config.hostname}/privacy)\n` +
            `[GitHub](https://github.com/Chicken/ChickenBot)`
    );
    message.channel.send({ embeds: [embed] });
};

exports.data = {
    permissions: 18432n,
    guildOnly: false,
    aliases: ["invite", "dashboard", "support"],
    name: "links",
    desc: "Useful links about the bot",
    usage: "links",
    perm: 0,
};
