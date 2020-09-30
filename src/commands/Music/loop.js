// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (message.guild.me.voice.channel && message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You must be in my voice channel to use this command!");
    client.db.set(message.guild.id, !client.db.get(message.guild.id, "settings.loop"), "settings.loop");
    message.channel.send("Looping status is now " + client.db.get(message.guild.id, "settings.loop"));
};
  
exports.data = {
    permissions: 36702208,
    guildOnly: true,
    aliases: ["luup", "lööp"],
    name: "loop",
    desc: "Makes the queue loop",
    usage: "loop",
    perm: 0
};