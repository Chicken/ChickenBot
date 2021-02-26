const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.reply("Please choose a number of messages to move");
    let amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) return message.reply("Please choose a number between 1 and 100.");
    let channel = message.mentions.channels.first();
    if (!channel) return message.channel.send("Please mention a channel.");
    await message.delete();

    let msgs = await message.channel.messages.fetch({ limit: amount });
    let deletable = msgs.filter(m => m.deletable);
    let old = deletable.filter(m => m.createdTimestamp < Date.now() - 1209600000);

    await message.channel.bulkDelete(deletable, true);
    for(let msg of old) msg.delete();

    for(let msg of msgs.array().reverse()) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            .setDescription(msg.content)
            .setColor(msg.member.displayHexColor)
            .setTimestamp(msg.createdTimestamp);
        if (msg.attachments.size != 0) {
            embed.addField("Attachments", msg.attachments.map(v => `[${v.name}](${v.proxyURL})`).join(" "));
        }
        await channel.send(embed);
    }
};
  
exports.data = {
    permissions: 388096,
    guildOnly: true,
    aliases: [],
    name: "move",
    desc: "Moves amount of messages from one channel to other.",
    usage: "move <1-100> <channel mention>",
    perm: 1
};
