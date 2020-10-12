// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    if (message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You are not in the same voice channel as me.");    let songs = client.db.get(message.guild.id).queue;
    const player = client.lavalink.players.get(message.guild.id);
    if (!player) return message.channel.send("I am not playing anything.");
    const {length} = client.music.get(message.guild.id, 'np');

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