const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.reply("Please choose a number of messages to move");
    const amount = parseInt(args[0], 10);
    if (Number.isNaN(amount) || amount < 1 || amount > 100)
        return message.reply("Please choose a number between 1 and 100.");
    const channel = message.mentions.channels.first();
    if (!channel) return message.channel.send("Please mention a channel.");
    await message.delete();

    const msgs = await message.channel.messages.fetch({ limit: amount });
    const deletable = msgs.filter((m) => m.deletable);
    const old = deletable.filter((m) => m.createdTimestamp < Date.now() - 1209600000);

    message.channel.bulkDelete(deletable, true);
    old.forEach((msg) => msg.delete());

    const toSend = [...msgs.values()].reverse();
    for (let i = 0; i < toSend.length; i += 1) {
        const msg = toSend[i];
        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            .setDescription(msg.content)
            .setColor(msg.member.displayHexColor)
            .setTimestamp(msg.createdTimestamp);
        if (msg.attachments.size !== 0) {
            embed.addField(
                "Attachments",
                msg.attachments.map((v) => `[${v.name}](${v.proxyURL})`).join(" ")
            );
        }
        // eslint-disable-next-line no-await-in-loop
        await channel.send({ embeds: [embed] });
    }
};

exports.data = {
    permissions: 388096n,
    guildOnly: true,
    aliases: [],
    name: "move",
    desc: "Moves amount of messages from one channel to other.",
    usage: "move <1-100> <channel mention>",
    perm: 1,
};
