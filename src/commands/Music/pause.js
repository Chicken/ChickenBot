// eslint-disable-next-line no-unused-vars
exports.execute = async (client, message, args) => {
    if (!message.guild.me.voice.channel) return message.channel.send("I am not playing anything.");
    if (message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send("You are not in the same voice channel as me.");
    const player = client.lavalink.players.get(message.guild.id);
    if (!player) return message.channel.send("I am not playing anything.");
    client.m.pause(message.guild.id);
    message.channel.send(player.paused ? "Resuming..." : "Pausing..." );
};
  
exports.data = {
    permissions: 36718592,
    guildOnly: true,
    aliases: ["resume"],
    name: "pause",
    desc: "Pause/resume a song.",
    usage: "pause\nresume",
    perm: 0
};