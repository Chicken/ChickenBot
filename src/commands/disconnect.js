exports.execute = async (client, message, args) => {
    if(!message.guild.me.voice.channel) return message.channel.send("I am not in any voicechannels.")
    message.guild.me.voice.channel.leave()
    client.db.set(message.guild.id, [], "queue")
    message.channel.send("Disconnected.")
};
  
exports.data = {
    permissions: 1050624,
    guildOnly: true,
    aliases: ["l", "leave", "dc"],
    category: "music",
    name: "disconnect",
    desc: "Disconnect from my current voice channel and clear the queue",
    usage: "disconnect",
    perm: 0
};