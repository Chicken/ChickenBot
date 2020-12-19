// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message) => {
    let msg = await message.channel.send("Pong!");
    msg.edit(`🏓 Pong! The latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${client.ws.ping}ms.`);
};
  
exports.data = {
    permissions: 2048,
    guildOnly: false,
    aliases: ["pong"],
    name: "ping",
    desc: "Bot's ping to discord",
    usage: "ping",
    perm: 0
};
