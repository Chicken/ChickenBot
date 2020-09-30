const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Links")
        .setDescription("[Invite](https://discordapp.com/oauth2/authorize?client_id=512663078819725313&scope=bot&permissions=37088454)\n"
                   +"[Support Server](https://discord.gg/jRN7SZB)\n"
                   +"[Website](https://chickenbot.antti.codes)\n"
                   +"[Privacy Policy](https://chickenbot.antti.codes/privacy)\n"
            + "[Github](https://github.com/chicken/chickenbot)");
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 18432,
    guildOnly: false,
    aliases: ["invite", "dashboard", "support"],
    name: "links",
    desc: "Useful links about the bot",
    usage: "links",
    perm: 0
};