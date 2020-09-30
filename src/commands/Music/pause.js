// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    if (message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You are not in the same voice channel as me.");
    message.guild.me.voice.connection.dispatcher.pause();
    message.channel.send("Pausing...");
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: [],
    name: "pause",
    desc: "Pauses a song.",
    usage: "pause",
    perm: 0
};