const { MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format")(moment);

const format = (time) => time >= 3600000 ? "h:mm:ss" : time < 60000 ? "[0:]ss" : "m:ss";

const parse = (s, i, client, message) => {
    let length = moment.duration(s.length).format(format(s.length), { trim: false });
    let currentTime = client?.lavalink?.players?.get(message.guild.id)?.position || 0;
    let current = moment.duration(currentTime).format(format(currentTime), { trim: false });
    return `${i > 0 ? `${i}.` : "**Now playing**"} [${s.name}](${s.url}) \`[${i == 0 ? `${current}/` : ""}${length}]\`\n`
    + `Requested by <@${s.user}>`;
};
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if(!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");

    let resultPerPage = 10;
    let { np, queue } = client.music.get(message.guild.id);

    let lines = [];
    lines.push(parse(np, 0, client, message));
    queue.forEach((s, i) => lines.push(parse(s, i + 1, client, message)));

    let totalTime = queue[0] ? queue.reduce((p, c) => c.length + p, 0) + np.length : np.length;
    let totalPages = Math.ceil(lines.length / resultPerPage);

    let pages = [];
    for(let page = 0; page < totalPages; page++) {
        let txt = lines.slice(resultPerPage * page, resultPerPage * page + resultPerPage).join("\n\n");
        let embed = new MessageEmbed()
            .setTitle("Queue")
            .setColor("BLUE")
            .setDescription(txt)
            .setTimestamp()
            .setFooter(`Page ${page + 1} out of ${totalPages} | Total length: ${moment.duration(totalTime).format(format(totalTime), { trim: true })}`);
        pages.push(embed);
    }

    client.paginatedEmbed(message, pages, null);
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