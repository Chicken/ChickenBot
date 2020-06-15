const bent = require("bent")
const Discord = require("discord.js")
exports.execute = async (client, message, args) => {
    let body = await bent("GET", 200, "json", {"x-api-key": client.config.thecatapi})("https://api.thecatapi.com/v1/images/search")
    let embed = new Discord.MessageEmbed()
    .setTitle("UwU here's a cat for u")
    .setImage(body[0].url)
    .setFooter('Powered by thecatapi.com')
    message.channel.send(embed)
};
  
exports.data = {
    guildOnly: false,
    aliases: ["kitty", "uwu", "owo"],
    category: "fun",
    name: "cat",
    desc: "Nice cat pics uwu",
    usage: "cat",
    perm: 0
};