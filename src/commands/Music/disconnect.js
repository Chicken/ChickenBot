// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not in any voicechannels.");
    message.guild.me.voice.channel.leave();
    client.queues[message.guild.id] = [];
    message.channel.send("Disconnected.");
};
  
exports.data = {
    permissions: 1050624,
    guildOnly: true,
    aliases: ["l", "leave", "dc"],
    name: "disconnect",
    desc: "Disconnect from my current voice channel and clear the queue",
    usage: "disconnect",
    perm: 0
};