// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let disconnected = client.m.disconnect(message.guild.id);
    if (!disconnected) return message.channel.send("I am not in any voice channels.");
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