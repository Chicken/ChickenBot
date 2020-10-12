const Discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let resultPerPage = 10;
    if (!args[0]) args[0] = 1;
    args[0] = parseInt(args[0]);
    let { np, queue } = client.music.get(message.guild.id);
    if (isNaN(args[0]) || Math.ceil((queue.length ? queue.length : 1) / resultPerPage) < args[0] || parseInt(args[0]) < 1) return message.channel.send("Not valid page number");
    let page = args[0] - 1;
    let moment = require("moment");
    require("moment-duration-format")(moment);
    const format = (time) => time >= 3600000 ? "h:mm:ss" : time < 60000 ? "[0:]ss" : "m:ss";
    const parse = (s, i) => {
        let length = moment.duration(s.length).format(format(s.length), { trim: false });
        let currentTime = client?.lavalink?.players?.get(message.guild.id)?.state?.position || 0;
        let current = moment.duration(currentTime).format(format(currentTime), { trim: false });
        return `${i > 0 ? `${i}.` : "**Now playing**"} [${s.name}](${s.url}) \`[${i == 0 ? `${current}/` : ""}${length}]\`
Requested by <@${s.user}>`;
    };
    let lines = [];
    if (np) {
        lines.push(parse(np, 0));
        queue.forEach((s, i) => lines.push(parse(s, i + 1)));
    }
    let txt = lines.slice(resultPerPage * page, resultPerPage * page + resultPerPage).join("\n\n");
    if (txt === "") lines = "No songs queued.";
    let totalTime = queue[0] ? queue.reduce((p, c) => c.length + p, 0) + np.length : np.length;
    let embed = new Discord.MessageEmbed()
        .setTitle("Queue")
        .setColor("BLUE")
        .setDescription(txt)
        .setTimestamp()
        .setFooter(`Page ${args[0]} out of ${Math.ceil(lines.length / resultPerPage)} | Total length: ${moment.duration(totalTime).format(format(totalTime), { trim: true })}`);
    message.channel.send(embed);
};

exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["q"],
    name: "queue",
    desc: "Shows music queue",
    usage: "queue",
    perm: 0
};