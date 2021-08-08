// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    const songs = client.music.get(message.guild.id, "queue");
    const num = parseInt(args[0], 10);
    if (Number.isNaN(num) || num < 1 || num > songs.length)
        return message.channel.send("Invalid song index.");
    const [removed] = songs.splice(num - 1, 1);
    client.music.set(message.guild.id, songs, "queue");
    message.channel.send(`Removed song  \`${removed.name}\``);
};

exports.data = {
    permissions: 36718592n,
    guildOnly: true,
    aliases: ["rem"],
    name: "remove",
    desc: "Removes song from queue",
    usage: "remove",
    perm: 0,
};
