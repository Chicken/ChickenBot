const Discord = require("discord.js")
exports.execute = async (client, message, args) => {
    const fetch = require("node-fetch")
    let res = await fetch("https://api.thecatapi.com/v1/images/search")
    let body = await res.json()
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