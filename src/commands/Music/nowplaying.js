const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    const player = client?.lavalink?.players?.get(message.guild.id);
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    let s = client.music.get(message.guild.id, "np");
    if (!s) return message.channel.send("I am not playing anything.");
    let moment = require("moment");
    require("moment-duration-format")(moment);
    const format = (time) => time >= 3600000 ? "h:mm:ss" : time < 60000 ? "[0:]ss" : "m:ss";
    let length = moment.duration(s.length).format(format(s.length), { trim: false });
    let currentTime = player.position || 0;
    let current = moment.duration(currentTime).format(format(currentTime), { trim: false });
    let p = Math.floor(player.position / s.length * 100);
    let embed = new Discord.MessageEmbed()
        .setTitle("Now Playing")
        .setDescription(`[${s.name}](${s.url})\nQueued by <@${s.user}>\n${p ? "[" : ""}${"▬".repeat(Math.round(p / 100 * 15))}${p ? `](${client.config.hostname} "${p}% done")` : ""}${"▬".repeat(15 - Math.round(p / 100 * 15))} \`[${current}/${length}]\``)
        .setThumbnail(s.image)
        .setTimestamp();
    if (s.image) { embed.setImage(s.image.url); }
    message.channel.send(embed);
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["np", "now", "playing"],
    name: "nowplaying",
    desc: "Shows the current song",
    usage: "nowplaying",
    perm: 0
};