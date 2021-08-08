const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const emoji =
        "🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿".split(" ");
    const choices = args.join(" ").split("-");
    const title = choices.shift() || "Poll";
    if (choices.length > 20 || choices.length < 2)
        return message.channel.send("Minimum amount of choices is 2 and maximum is 20");
    let poll = "";
    choices.forEach((c, i) => {
        poll += `${emoji[i]} ${c}\n`;
    });
    const embed = new Discord.MessageEmbed().setTitle(title).setDescription(poll);
    const msg = await message.channel.send({ embeds: [embed] });
    for (let i = 0; i < choices.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await msg.react(emoji[i]);
    }
};

exports.data = {
    permissions: 280640n,
    guildOnly: true,
    aliases: ["choose"],
    name: "poll",
    desc: "Creates a poll, start your choices with -'s.",
    usage: "poll [title] -<option> (-[option]...19)",
    perm: 1,
};
