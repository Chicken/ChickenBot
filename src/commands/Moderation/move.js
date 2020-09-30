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
    let deletable = await msgs.filter(m => m.deletable);
    let old = await deletable.filter(m => m.createdTimestamp < m.createdTimestamp - 1209600000);
    await deletable.forEach(async m  => {
        await channel.messages.fetch(m.id, true);
    });
    await channel.bulkDelete(deletable);
    await old.forEach(async m => { await channel.messages.delete(m.id); });
    await msgs.array().reverse().forEach(async msg=>{
        let embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            .setDescription(msg.content)
            .setColor(message.member.displayHexColor)
            .setTimestamp(msg.createdTimestamp);
        if (msg.attachments.size != 0) {
            embed.addField("Attachments", msg.attachments.map(v => `[${v.name}](${v.proxyURL})`).join(" "));
        }
        await channel.send(embed);
    });

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