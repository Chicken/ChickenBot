// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    if (message.guild.me.voice.channel !== message.member.voice.channel)
        return message.channel.send("You are not in the same voice channel as me.");
    const player = client.lavalink.players.get(message.guild.id);
    if (!player) return message.channel.send("I am not playing anything.");
    const { length } = client.music.get(message.guild.id, "np");
    const userTime = args.join(" ").split(":");
    if (userTime.length > 3) return message.channel.send("Invalid time.");
    while (userTime.length < 3) {
        userTime.unshift("00");
    }
    const time = userTime.reduce((p, c, i) => {
        c = parseInt(c, 10);
        if (i <= 2) c *= 1000;
        if (i <= 1) c *= 60;
        if (i <= 0) c *= 60;
        return c + p;
    }, 0);
    if (Number.isNaN(time) || time < 0 || time > length)
        return message.channel.send("Invalid time.");
    player.seek(time);
    message.channel.send("Going to timestamp...");
};

exports.data = {
    permissions: 36718592n,
    guildOnly: true,
    aliases: [],
    name: "seek",
    desc: "Goes to a specific point in video",
    usage: "seek <timestamp>",
    perm: 0,
};
