const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send("Give me link to message");
    let parts = args[0].split("/");
    let channel = await client.channels.cache.get(parts[5]);
    let quoted = await channel.messages.fetch(parts[6]);
    let embed = new Discord.MessageEmbed()
        .setAuthor(`${quoted.author.tag}`, `${quoted.author.displayAvatarURL()}`)
        .setColor("FFFFFF")
        .setDescription(`${quoted.content}`)
        .setFooter(`In ${quoted.guild.name}, #${quoted.channel.name}, at ${quoted.createdAt}`);
    if (quoted.attachments.size != 0) {
        embed.addField("Attachments", quoted.attachments.map(v => `[${v.name}](${v.proxyURL})`).join(" "));
    }
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 379904,
    guildOnly: false,
    aliases: ["quote", "fetch", "peek"],
    name: "get",
    desc: "Quotes a discord message from link.",
    usage: "get <discord message url>",
    perm: 0
};