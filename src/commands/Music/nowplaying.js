const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    let s = client.queues[message.guild.id][0];

    let moment = require("moment");
    require("moment-duration-format")(moment);

    let length = moment.duration(parseInt(s.length), "seconds").format("HH:mm:ss", { trim: false });
    if (length[0] === "0" && length[1] === "0") length = length.substring(3);

    let current;
    try{
        current = moment.duration(message.guild.me.voice.connection.dispatcher.streamTime, "milliseconds").format("HH:mm:ss", { trim: false });
    } catch(e){
        current = "00:00";
    }
    if (current[0] === "0" && current[1] === "0") current = current.substring(3);

    let embed = new Discord.MessageEmbed()
        .setTitle("Now Playing")
        .setDescription(`[${s.name}](${s.url}) \`[${current}/${length}]\`\nQueued by \`${client.users.cache.get(s.user).tag}\``)
        .setTimestamp();
    if (s.image) { embed.setImage(s.image.url); }
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["np", "now"],
    name: "nowplaying",
    desc: "Shows the current song",
    usage: "nowplaying",
    perm: 0
};