const { MessageEmbed } = require("discord.js");

const parse = (s, i, client, message) => {
    const length = client.formatLength(s.length);
    const currentTime = client?.lavalink?.players?.get(message.guild.id)?.position || 0;
    const current = client.formatLength(currentTime);
    return `${i > 0 ? `${i}.` : "**Now playing**"} [${s.name}](${s.url}) \`[${
        i === 0 ? `${current}/` : ""
    }${length}]\`\nRequested by <@${s.user}>`;
};
// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");

    const resultPerPage = 10;
    const { np, queue } = client.music.get(message.guild.id);

    const lines = [];
    lines.push(parse(np, 0, client, message));
    queue.forEach((s, i) => lines.push(parse(s, i + 1, client, message)));

    const totalTime = queue[0] ? queue.reduce((p, c) => c.length + p, 0) + np.length : np.length;
    const totalPages = Math.ceil(lines.length / resultPerPage);

    const pages = [];
    for (let page = 0; page < totalPages; page += 1) {
        const txt = lines
            .slice(resultPerPage * page, resultPerPage * page + resultPerPage)
            .join("\n\n");
        const embed = new MessageEmbed()
            .setTitle("Queue")
            .setColor("BLUE")
            .setDescription(txt)
            .setTimestamp()
            .setFooter(
                `Page ${page + 1} out of ${totalPages} | Total length: ${client.formatLength(
                    totalTime
                )}`
            );
        pages.push(embed);
    }

    client.paginatedEmbed(message, pages, null);
};

exports.data = {
    permissions: 36718592n,
    guildOnly: true,
    aliases: ["q"],
    name: "queue",
    desc: "Shows music queue",
    usage: "queue",
    perm: 0,
};
