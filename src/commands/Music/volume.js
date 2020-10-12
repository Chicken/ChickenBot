// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    let volume = client.music.get(message.guild.id, "volume");
    if (!args[0]) return message.channel.send(`Current volume is ${volume === 69 ? "Nice" : volume}`);
    volume = parseInt(args[0]);
    if (isNaN(volume) || volume < 1 || volume > 150) return message.channel.send("Incorrect volume. Give volume between 1-150");
    client.music.set(message.guild.id, volume, "volume");
    message.channel.send(`Volume is now ${volume === 69 ? "Nice" : volume}`);
    if (client.lavalink.players.has(message.guild.id)) client.m.volume(message.guild.id, volume);
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