// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    if (!message.guild.me.voice.connection.dispatcher.paused) return message.channel.send("The song is not paused.");
    if (message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You are not in the same voice channel as me.");
    message.guild.me.voice.connection.dispatcher.resume();
    message.channel.send("Resuming...");
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: [],
    name: "resume",
    desc: "Resumes a paused a song.",
    usage: "resume",
    perm: 0
};