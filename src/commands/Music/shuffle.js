// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    if (message.guild.me.voice.channel !== message.member.voice.channel)
        return message.channel.send("You are not in the same voice channel as me.");
    const player = client.lavalink.players.get(message.guild.id);
    if (!player) return message.channel.send("I am not playing anything.");
    client.m.shuffle(message.guild.id);
    message.channel.send("Shuffled!");
};

exports.data = {
    permissions: 36718592n,
    guildOnly: true,
    aliases: ["sh"],
    name: "shuffle",
    desc: "Shuffle the queue.",
    usage: "shuffle",
    perm: 0,
};
