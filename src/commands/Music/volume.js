// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!args[0]) return message.channel.send(("Current volume is " + client.db.get(message.guild.id, "settings.volume") * 100).replace("69", "***NICE!***"));
    if (message.guild.me.voice.channel && message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You must be in my voice channel to use this command!");
    let volume = parseInt(args[0]);
    if (isNaN(volume) || volume < 1 || volume > 200) return message.channel.send("Incorrect volume. Give volume between 1-200");
    volume = volume / 100;
    client.db.set(message.guild.id, volume, "settings.volume");
    if(message.guild.me.voice.connection) message.guild.me.voice.connection.dispatcher.setVolume(volume);
    message.channel.send(("Volume is now " + client.db.get(message.guild.id, "settings.volume") * 100).replace("69", "***NICE!***"));
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["v"],
    name: "volume",
    desc: "Sets volume of song",
    usage: "volume <1-200>",
    perm: 0
};