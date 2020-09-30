// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.connection.dispatcher) return message.channel.send("I am not playing anything.");
    if (message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You are not in the same voice channel as me.");
    let songs = client.db.get(message.guild.id).queue;
    let current = songs.shift();
    current.time = args[0];
    songs.unshift({ ...current });
    current.time = undefined;
    songs.unshift({ ...current });
    await client.db.set(message.guild.id, songs, "queue");
    await message.guild.me.voice.connection.dispatcher.destroy();
    message.channel.send("Going to timestamp...");
};
  
exports.data = {
    permissions: 36718592,
    disabled: true,
    guildOnly: true,
    aliases: [],
    name: "seek",
    desc: "Goes to a specific point in video",
    usage: "seek <timestamp>",
    perm: 0
};